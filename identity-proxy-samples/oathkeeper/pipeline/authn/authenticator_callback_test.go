package authn_test

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/julienschmidt/httprouter"
	"github.com/ory/x/configx"
	"github.com/ory/x/logrusx"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"github.com/tidwall/sjson"

	"github.com/ory/oathkeeper/driver/configuration"
	"github.com/ory/oathkeeper/internal"
	. "github.com/ory/oathkeeper/pipeline/authn"
	"github.com/ory/oathkeeper/pipeline/session_store"
)

func TestAuthenticatorCallback(t *testing.T) {
	t.Parallel()
	conf := internal.NewConfigurationWithDefaults()
	reg := internal.NewRegistry(conf)

	session_store.GlobalStore = session_store.NewStore()

	a, err := reg.PipelineAuthenticator("callback")
	require.NoError(t, err)
	assert.Equal(t, "callback", a.GetID())

	t.Run("method=authenticate", func(t *testing.T) {
		for k, tc := range []struct {
			d              string
			setup          func(*testing.T, *httprouter.Router)
			r              *http.Request
			config         json.RawMessage
			expectErr      bool
			expectExactErr error
			expectSess     *AuthenticationSession
		}{
			{
				d:         "should fail because no authorization code",
				r:         &http.Request{URL: &url.URL{RawQuery: ""}},
				expectErr: true,
				config:    json.RawMessage(`{"client_id": "test", "client_secret": "secret", "redirect_url": "http://localhost/callback"}`),
			},
			{
				d:         "should fail because no state parameter",
				r:         &http.Request{URL: &url.URL{RawQuery: "code=test_code"}},
				expectErr: true,
				config:    json.RawMessage(`{"client_id": "test", "client_secret": "secret", "redirect_url": "http://localhost/callback"}`),
			},
			{
				d: "should pass with valid authorization code and state",
				r: &http.Request{
					URL:        &url.URL{RawQuery: "code=valid_code&state=valid_state"},
					RemoteAddr: "127.0.0.1",
					Header:     http.Header{"User-Agent": []string{"test-agent"}},
				},
				config: json.RawMessage(`{
					"client_id": "test_client",
					"client_secret": "test_secret",
					"redirect_url": "http://localhost/callback",
					"token_endpoint_auth_method": "client_secret_post"
				}`),
				expectErr: false,
				setup: func(t *testing.T, router *httprouter.Router) {
					session_store.GlobalStore.AddStateEntry("valid_state", "test-agent", "http://localhost/request", "http://localhost/callback", "code_verifier_123")

					router.POST("/oauth2/token", func(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
						err := r.ParseForm()
						require.NoError(t, err)

						assert.Equal(t, "authorization_code", r.Form.Get("grant_type"))
						assert.Equal(t, "valid_code", r.Form.Get("code"))
						assert.Equal(t, "test_client", r.Form.Get("client_id"))
						assert.Equal(t, "test_secret", r.Form.Get("client_secret"))

						w.Header().Set("Content-Type", "application/json")
						w.WriteHeader(http.StatusOK)
						json.NewEncoder(w).Encode(map[string]interface{}{
							"access_token": "test_access_token",
							"id_token":     "test_id_token",
							"token_type":   "Bearer",
							"expires_in":   3600,
						})
					})

					router.GET("/oauth2/userinfo", func(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
						auth := r.Header.Get("Authorization")
						assert.Equal(t, "Bearer test_access_token", auth)

						w.Header().Set("Content-Type", "application/json")
						w.WriteHeader(http.StatusOK)
						json.NewEncoder(w).Encode(map[string]interface{}{
							"sub":      "user123",
							"username": "testuser",
							"name":     "Test User",
						})
					})
				},
				expectSess: &AuthenticationSession{
					Subject: "user123",
					Extra: map[string]interface{}{
						"access_token": "test_access_token",
						"id_token":     "test_id_token",
						"sub":          "user123",
						"username":     "testuser",
						"name":         "Test User",
					},
				},
			},
			{
				d: "should fail with invalid state",
				r: &http.Request{URL: &url.URL{RawQuery: "code=valid_code&state=invalid_state"}},
				config: json.RawMessage(`{
					"client_id": "test_client",
					"client_secret": "test_secret",
					"redirect_url": "http://localhost/callback",
					"token_endpoint_auth_method": "client_secret_post"
				}`),
				expectErr: true,
			},
			{
				d: "should handle client_secret_basic auth method",
				r: &http.Request{
					URL:        &url.URL{RawQuery: "code=valid_code&state=valid_state_basic"},
					RemoteAddr: "127.0.0.1",
					Header:     http.Header{"User-Agent": []string{"test-agent"}},
				},
				config: json.RawMessage(`{
					"client_id": "test_client",
					"client_secret": "test_secret",
					"redirect_url": "http://localhost/callback",
					"token_endpoint_auth_method": "client_secret_basic"
				}`),
				expectErr: false,
				setup: func(t *testing.T, router *httprouter.Router) {
					session_store.GlobalStore.AddStateEntry("valid_state_basic", "test-agent", "http://localhost/request", "http://localhost/callback", "code_verifier_123")

					router.POST("/oauth2/token", func(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
						username, password, ok := r.BasicAuth()
						assert.True(t, ok)
						assert.Equal(t, "test_client", username)
						assert.Equal(t, "test_secret", password)

						w.Header().Set("Content-Type", "application/json")
						w.WriteHeader(http.StatusOK)
						json.NewEncoder(w).Encode(map[string]interface{}{
							"access_token": "test_access_token_basic",
							"token_type":   "Bearer",
							"expires_in":   3600,
						})
					})

					router.GET("/oauth2/userinfo", func(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
						w.Header().Set("Content-Type", "application/json")
						w.WriteHeader(http.StatusOK)
						json.NewEncoder(w).Encode(map[string]interface{}{
							"sub":      "user456",
							"username": "basicuser",
							"name":     "Basic User",
						})
					})
				},
			},
		} {
			t.Run(fmt.Sprintf("case=%d/description=%s", k, tc.d), func(t *testing.T) {
				router := httprouter.New()
				if tc.setup != nil {
					tc.setup(t, router)
				}
				ts := httptest.NewServer(router)
				defer ts.Close()

				// Update config with test server URLs
				tc.config, _ = sjson.SetBytes(tc.config, "token_url", ts.URL+"/oauth2/token")
				tc.config, _ = sjson.SetBytes(tc.config, "userinfo_url", ts.URL+"/oauth2/userinfo")

				sess := &AuthenticationSession{
					Header: make(http.Header),
				}
				err := a.Authenticate(tc.r, sess, tc.config, nil)

				if tc.expectErr {
					require.Error(t, err)
					if tc.expectExactErr != nil {
						assert.EqualError(t, err, tc.expectExactErr.Error())
					}
				} else {
					require.NoError(t, err)
				}

				if tc.expectSess != nil {
					assert.Equal(t, tc.expectSess.Subject, sess.Subject)
					if sess.Extra != nil {
						assert.Equal(t, tc.expectSess.Extra["sub"], sess.Extra["sub"])
						assert.Equal(t, tc.expectSess.Extra["username"], sess.Extra["username"])
						assert.Equal(t, tc.expectSess.Extra["name"], sess.Extra["name"])
						assert.NotEmpty(t, sess.Extra["IG_SESSION_ID"])
						assert.NotEmpty(t, sess.Header.Get("IG_SESSION_ID"))
					}
				}
			})
		}
	})

	t.Run("method=validate", func(t *testing.T) {
		logger := logrusx.New("", "")
		testConf, err := configuration.NewKoanfProvider(
			context.Background(),
			nil,
			logger,
			configx.SkipValidation(),
		)
		require.NoError(t, err)

		testReg := internal.NewRegistry(testConf)
		testAuth, err := testReg.PipelineAuthenticator("callback")
		require.NoError(t, err)

		testConf.SetForTest(t, configuration.AuthenticatorCallbackIsEnabled, true)

		validConfig := json.RawMessage(`{
			"client_id": "test",
			"client_secret": "secret",
			"redirect_url": "http://localhost/callback",
			"token_url": "http://localhost/token",
			"userinfo_url": "http://localhost/userinfo"
		}`)
		require.NoError(t, testAuth.Validate(validConfig))

		invalidConfig := json.RawMessage(`{"client_id": ""}`)
		require.Error(t, testAuth.Validate(invalidConfig))

		testConf.SetForTest(t, configuration.AuthenticatorCallbackIsEnabled, false)
		require.Error(t, testAuth.Validate(validConfig))
	})
}
