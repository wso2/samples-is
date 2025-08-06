package authn

import (
	"crypto/md5"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"

	"github.com/dgraph-io/ristretto"
	"github.com/ory/oathkeeper/driver/configuration"
	"github.com/ory/oathkeeper/pipeline"
	"github.com/ory/oathkeeper/pipeline/session_store"
	"github.com/ory/x/httpx"
	"github.com/ory/x/logrusx"
	"github.com/ory/x/otelx"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
	"go.opentelemetry.io/otel/trace"
)

type AuthenticatorCallbackConfiguration struct {
	ClientID                string                                   `json:"client_id"`
	ClientSecret            string                                   `json:"client_secret"`
	TokenEndpoint           string                                   `json:"token_url"`
	UserInforEndpoint       string                                   `json:"userinfo_url"`
	RedirectURL             string                                   `json:"redirect_url"`
	TokenEndpointAuthMethod string                                   `json:"token_endpoint_auth_method"`
	Retry                   *AuthenticatorCallbackRetryConfiguration `json:"retry"`
	Cache                   cacheConfig
}

type AuthenticatorCallbackRetryConfiguration struct {
	Timeout string `json:"max_delay"`
	MaxWait string `json:"give_up_after"`
}

type AuthenticatorCallback struct {
	c         configuration.Provider
	clientMap map[string]*http.Client

	mu         sync.RWMutex
	tokenCache *ristretto.Cache[string, []byte]
	cacheTTL   *time.Duration
	logger     *logrusx.Logger
	provider   trace.TracerProvider
}

func NewAuthenticatorCallback(c configuration.Provider, logger *logrusx.Logger, provider trace.TracerProvider) *AuthenticatorCallback {
	// Create token cache
	tokenCache, err := ristretto.NewCache(&ristretto.Config[string, []byte]{
		NumCounters: 1e7,
		MaxCost:     1 << 30,
		BufferItems: 64,
	})
	if err != nil {
		logger.Fatal("Failed to create token cache", err)
	}

	return &AuthenticatorCallback{
		c:          c,
		logger:     logger,
		provider:   provider,
		clientMap:  make(map[string]*http.Client),
		tokenCache: tokenCache,
	}
}

func (a *AuthenticatorCallback) GetID() string {
	return "callback"
}

func (a *AuthenticatorCallback) Validate(config json.RawMessage) error {
	if !a.c.AuthenticatorIsEnabled(a.GetID()) {
		return NewErrAuthenticatorNotEnabled(a)
	}

	_, _, err := a.Config(config)
	return err
}

func (a *AuthenticatorCallback) Config(config json.RawMessage) (*AuthenticatorCallbackConfiguration, *http.Client, error) {
	var c AuthenticatorCallbackConfiguration
	if err := a.c.AuthenticatorConfig(a.GetID(), config, &c); err != nil {
		return nil, nil, NewErrAuthenticatorMisconfigured(a, err)
	}

	rawKey, err := json.Marshal(&c)
	if err != nil {
		return nil, nil, errors.WithStack(err)
	}

	clientKey := fmt.Sprintf("%x", md5.Sum(rawKey))
	a.mu.RLock()
	client, ok := a.clientMap[clientKey]
	a.mu.RUnlock()

	if !ok || client == nil {
		a.logger.Debug("Initializing http client")
		var rt http.RoundTripper

		if c.Retry == nil {
			c.Retry = &AuthenticatorCallbackRetryConfiguration{Timeout: "500ms", MaxWait: "1s"}
		} else {
			if c.Retry.Timeout == "" {
				c.Retry.Timeout = "500ms"
			}
			if c.Retry.MaxWait == "" {
				c.Retry.MaxWait = "1s"
			}
		}
		duration, err := time.ParseDuration(c.Retry.Timeout)
		if err != nil {
			return nil, nil, errors.WithStack(err)
		}
		timeout := time.Millisecond * duration

		maxWait, err := time.ParseDuration(c.Retry.MaxWait)
		if err != nil {
			return nil, nil, errors.WithStack(err)
		}

		client = httpx.NewResilientClient(
			httpx.ResilientClientWithMaxRetryWait(maxWait),
			httpx.ResilientClientWithConnectionTimeout(timeout),
		).StandardClient()
		client.Transport = otelhttp.NewTransport(rt, otelhttp.WithTracerProvider(a.provider))
		a.mu.Lock()
		a.clientMap[clientKey] = client
		a.mu.Unlock()
	}

	if c.Cache.TTL != "" {
		cacheTTL, err := time.ParseDuration(c.Cache.TTL)
		if err != nil {
			return nil, nil, err
		}
		if a.tokenCache != nil {
			if a.cacheTTL == nil || (a.cacheTTL != nil && a.cacheTTL.Seconds() > cacheTTL.Seconds()) {
				a.tokenCache.Clear()
			}
		}

		a.cacheTTL = &cacheTTL
	}

	if a.tokenCache == nil {
		cost := int64(c.Cache.MaxCost)
		if cost == 0 {
			cost = 100000000
		}
		a.logger.Debugf("Creating cache with max cost: %d", c.Cache.MaxCost)
		cache, err := ristretto.NewCache(&ristretto.Config[string, []byte]{
			NumCounters: cost * 10,
			MaxCost:     cost,
			BufferItems: 64,
			Cost: func(value []byte) int64 {
				return 1
			},
			IgnoreInternalCost: true,
		})
		if err != nil {
			return nil, nil, err
		}

		a.tokenCache = cache
	}

	return &c, client, nil
}

func (a *AuthenticatorCallback) Authenticate(r *http.Request, session *AuthenticationSession, config json.RawMessage, rule pipeline.Rule) (err error) {
	tp := trace.SpanFromContext(r.Context()).TracerProvider()
	ctx, span := tp.Tracer("oauthkeeper/pipeline/authn").Start(r.Context(), "pipeline.authn.AuthenticatorCallback.Authenticate")
	defer otelx.End(span, &err)
	r = r.WithContext(ctx)

	cf, client, err := a.Config(config)
	if err != nil {
		return err
	}

	requestURL := r.URL
	authCode := requestURL.Query().Get("code")

	a.logger.WithField("auth_code_present", authCode != "").Debug("Processing authentication callback")

	state := requestURL.Query().Get("state")
	if state != "" {
		a.logger.Debug("State found in URL")
	} else {
		a.logger.Debug("State not found in URL")
	}

	if authCode == "" {
		return errors.New("authorization code not found in callback URL")
	}

	if state == "" {
		return errors.New("state parameter missing from callback request")
	}

	stateEntry, valid := session_store.GlobalStore.ValidateAndRemoveState(state, r.UserAgent())
	if !valid {
		return errors.New("invalid state: possible CSRF attack, session expiry, or security validation failure (User-Agent mismatch)")
	}

	a.logger.Debug("State validated successfully. Proceeding with authorization code")
	data := url.Values{}
	data.Set("grant_type", "authorization_code")
	data.Set("code", authCode)
	data.Set("redirect_uri", cf.RedirectURL)
	if stateEntry.CodeVerifier != "" {
		data.Set("code_verifier", stateEntry.CodeVerifier)
	}
	if cf.TokenEndpointAuthMethod == "client_secret_post" {
		data.Set("client_id", cf.ClientID)
		data.Set("client_secret", cf.ClientSecret)
	}

	req, err := http.NewRequestWithContext(ctx, "POST", cf.TokenEndpoint, strings.NewReader(data.Encode()))
	a.logger.WithFields(logrus.Fields{
		"token_endpoint":      cf.TokenEndpoint,
		"client_id":           cf.ClientID,
		"redirect_url":        cf.RedirectURL,
		"token_endpoint_auth": cf.TokenEndpointAuthMethod,
		"user_info_endpoint":  cf.UserInforEndpoint,
	}).Debug("Creating token request")

	if err != nil {
		return errors.Wrap(err, "failed to create token request")
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	if cf.TokenEndpointAuthMethod == "client_secret_basic" {
		auth := base64.StdEncoding.EncodeToString([]byte(fmt.Sprintf("%s:%s", cf.ClientID, cf.ClientSecret)))
		req.Header.Set("Authorization", fmt.Sprintf("Basic %s", auth))
	} else if cf.TokenEndpointAuthMethod != "client_secret_post" {
		return errors.Errorf("unsupported token endpoint auth method: %s", cf.TokenEndpointAuthMethod)
	}

	resp, err := client.Do(req)
	if err != nil {
		return errors.Wrap(err, "failed to make token request")
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return errors.Errorf("token endpoint returned %d: %s", resp.StatusCode, string(body))
	}

	var tokenResponse struct {
		AccessToken  string `json:"access_token"`
		TokenType    string `json:"token_type"`
		ExpiresIn    int    `json:"expires_in"`
		RefreshToken string `json:"refresh_token"`
		IDToken      string `json:"id_token"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&tokenResponse); err != nil {
		return errors.Wrap(err, "failed to decode token response")
	}
	a.logger.WithField("access_token", tokenResponse.AccessToken).Debug("Received access token")
	a.logger.WithField("id_token", tokenResponse.IDToken).Debug("Received ID token")

	if session.Extra == nil {
		session.Extra = make(map[string]interface{})
	}
	session.Extra["access_token"] = tokenResponse.AccessToken
	if tokenResponse.IDToken != "" {
		session.Extra["id_token"] = tokenResponse.IDToken
	}
	if tokenResponse.AccessToken != "" {
		session.SetHeader("Authorization", fmt.Sprintf("Bearer %s", tokenResponse.AccessToken))
	}

	req1, err := http.NewRequestWithContext(ctx, "GET", cf.UserInforEndpoint, strings.NewReader(data.Encode()))
	req1.Header.Set("Authorization", fmt.Sprintf("Bearer %s", tokenResponse.AccessToken))
	resp1, err := client.Do(req1)
	if err != nil {
		return errors.Wrap(err, "failed to make userinfo request")
	}
	defer resp1.Body.Close()
	if resp1.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp1.Body)
		return errors.Errorf("userinfo endpoint returned %d: %s", resp1.StatusCode, string(body))
	}

	var userInfoResponse struct {
		Sub      string  `json:"sub"`
		Username *string `json:"username,omitempty"`
		Email    *string `json:"email,omitempty"`
		Name     *string `json:"name,omitempty"`
	}
	// Decode the user info response from the API
	if err := json.NewDecoder(resp1.Body).Decode(&userInfoResponse); err != nil {
		return errors.Wrap(err, "failed to decode userInfo response")
	}

	// Log the user information for debugging
	a.logger.WithFields(logrus.Fields{
		"sub":      userInfoResponse.Sub,
		"username": userInfoResponse.Username,
		"email":    userInfoResponse.Email,
		"name":     userInfoResponse.Name,
	}).Debug("Received user info")

	// Store the user info in the session's Extra field
	if session.Extra == nil {
		session.Extra = make(map[string]interface{})
	}

	// Set the subject from the userinfo response
	session.Subject = userInfoResponse.Sub

	// Store the user information in the session, converting pointers to values
	session.Extra["sub"] = userInfoResponse.Sub
	if userInfoResponse.Username != nil {
		session.Extra["username"] = *userInfoResponse.Username
	}
	if userInfoResponse.Name != nil {
		session.Extra["name"] = *userInfoResponse.Name
	}

	// Set the Authorization header for the session
	if tokenResponse.AccessToken != "" {
		session.SetHeader("Authorization", fmt.Sprintf("Bearer %s", tokenResponse.AccessToken))
	}
	id, err := session_store.GenerateSessionID()
	if err != nil {
		a.logger.WithError(err).Fatal("Failed to generate session ID")
		return err
	}

	// Create session for session store, handling nil username safely
	username := ""
	if userInfoResponse.Username != nil {
		username = *userInfoResponse.Username
	}

	sess := session_store.Session{
		ID:           id,
		Username:     username,
		Sub:          userInfoResponse.Sub,
		IssuedAt:     time.Now(),
		ExpiresAt:    time.Now().Add(1 * time.Hour),
		AccessToken:  tokenResponse.AccessToken,
		IDToken:      tokenResponse.IDToken,
		CodeVerifier: stateEntry.CodeVerifier,
	}
	session_store.GlobalStore.AddSession(sess)
	a.logger.WithField("session_id", id).Info("Generated and stored session")
	a.logger.Debug("Setting session ID into authentication session")
	session.SetHeader("IG_SESSION_ID", id)
	session.Extra["IG_SESSION_ID"] = id

	if stateEntry.UpstreamURL != "" {
		session.Extra["upstream_url"] = stateEntry.UpstreamURL
		a.logger.WithField("upstream_url", stateEntry.UpstreamURL).Debug("Retrieved upstream URL from state entry")
	}

	if stateEntry.RequestURL != "" {
		session.Extra["request_url"] = stateEntry.RequestURL
		a.logger.WithField("request_url", stateEntry.RequestURL).Debug("Retrieved request URL from state entry")
	}

	return nil

}
