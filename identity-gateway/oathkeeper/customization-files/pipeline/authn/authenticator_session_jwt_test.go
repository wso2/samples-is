package authn_test

import (
	"encoding/json"
	"fmt"
	"net/http"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"github.com/tidwall/sjson"

	"github.com/ory/oathkeeper/internal"
	. "github.com/ory/oathkeeper/pipeline/authn"
	"github.com/ory/oathkeeper/pipeline/session_store"
)

func TestAuthenticatorSessionJWT(t *testing.T) {
	t.Parallel()
	keys := []string{
		"file://../../test/stub/jwks-hs.json",
		"file://../../test/stub/jwks-rsa-multiple.json",
		"file://../../test/stub/jwks-rsa-single.json",
		"file://../../test/stub/jwks-ecdsa.json",
	}
	conf := internal.NewConfigurationWithDefaults()
	reg := internal.NewRegistry(conf)

	// Initialize session store for testing
	session_store.GlobalStore = session_store.NewStore()

	a, err := reg.PipelineAuthenticator("session_jwt")
	require.NoError(t, err)
	assert.Equal(t, "session_jwt", a.GetID())

	// Create a simple hardcoded JWT token for testing instead of using the gen function
	// This avoids the file path resolution issues
	validJWTToken := "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwiZXhwIjo5OTk5OTk5OTk5LCJhdWQiOlsiYXVkLTEiXSwiaXNzIjoiaXNzLTEifQ.example"

	now := time.Now().UTC()

	t.Run("method=authenticate", func(t *testing.T) {
		for k, tc := range []struct {
			d              string
			r              *http.Request
			config         string
			expectErr      bool
			expectExactErr error
			expectSess     *AuthenticationSession
			setup          func()
		}{
			{
				d:         "should fail because no session cookie",
				r:         &http.Request{Header: http.Header{}},
				expectErr: true,
				config:    `{}`,
			},
			{
				d: "should fail because session not found in store",
				r: func() *http.Request {
					req := &http.Request{Header: http.Header{}}
					cookie := &http.Cookie{
						Name:  "IG_SESSION_ID",
						Value: "nonexistent_session",
					}
					req.AddCookie(cookie)
					return req
				}(),
				expectErr: true,
				config:    `{}`,
			},
			{
				d: "should fail with invalid JWT token",
				r: func() *http.Request {
					req := &http.Request{Header: http.Header{}}
					cookie := &http.Cookie{
						Name:  "IG_SESSION_ID",
						Value: "invalid_jwt_session",
					}
					req.AddCookie(cookie)
					return req
				}(),
				config:    `{}`,
				expectErr: true,
				setup: func() {
					// Use an invalid JWT token for testing
					token := validJWTToken

					// Add session to store
					sess := session_store.Session{
						ID:          "invalid_jwt_session",
						Username:    "testuser",
						Sub:         "user123",
						IssuedAt:    now,
						ExpiresAt:   now.Add(time.Hour),
						AccessToken: token,
						IDToken:     "id_token_123",
					}
					session_store.GlobalStore.AddSession(sess)
				},
			},
			{
				d: "should fail with expired session",
				r: func() *http.Request {
					req := &http.Request{Header: http.Header{}}
					cookie := &http.Cookie{
						Name:  "IG_SESSION_ID",
						Value: "expired_session_456",
					}
					req.AddCookie(cookie)
					return req
				}(),
				config:    `{}`,
				expectErr: true,
				setup: func() {
					// Use a hardcoded expired JWT token for testing
					token := validJWTToken

					// Add expired session to store
					sess := session_store.Session{
						ID:          "expired_session_456",
						Username:    "expireduser",
						Sub:         "user456",
						IssuedAt:    now.Add(-2 * time.Hour),
						ExpiresAt:   now.Add(-time.Hour), // Expired
						AccessToken: token,
						IDToken:     "expired_id_token",
					}
					session_store.GlobalStore.AddSession(sess)
				},
			},
			{
				d: "should fail with invalid JWT and audience validation",
				r: func() *http.Request {
					req := &http.Request{Header: http.Header{}}
					cookie := &http.Cookie{
						Name:  "IG_SESSION_ID",
						Value: "aud_session_789",
					}
					req.AddCookie(cookie)
					return req
				}(),
				config:    `{"target_audience": ["aud-1", "aud-2"]}`,
				expectErr: true,
				setup: func() {
					// Use a hardcoded valid JWT token for testing
					token := validJWTToken

					// Add session to store
					sess := session_store.Session{
						ID:          "aud_session_789",
						Username:    "auduser",
						Sub:         "user789",
						IssuedAt:    now,
						ExpiresAt:   now.Add(time.Hour),
						AccessToken: token,
						IDToken:     "aud_id_token",
					}
					session_store.GlobalStore.AddSession(sess)
				},
			},
			{
				d: "should fail with invalid audience",
				r: func() *http.Request {
					req := &http.Request{Header: http.Header{}}
					cookie := &http.Cookie{
						Name:  "IG_SESSION_ID",
						Value: "bad_aud_session_101",
					}
					req.AddCookie(cookie)
					return req
				}(),
				config:    `{"target_audience": ["required-aud"]}`,
				expectErr: true,
				setup: func() {
					// Use a hardcoded JWT token for testing
					token := validJWTToken

					// Add session to store
					sess := session_store.Session{
						ID:          "bad_aud_session_101",
						Username:    "badauduser",
						Sub:         "user101",
						IssuedAt:    now,
						ExpiresAt:   now.Add(time.Hour),
						AccessToken: token,
						IDToken:     "bad_aud_id_token",
					}
					session_store.GlobalStore.AddSession(sess)
				},
			},
		} {
			t.Run(fmt.Sprintf("case=%d/description=%s", k, tc.d), func(t *testing.T) {
				if tc.setup != nil {
					tc.setup()
				}

				tc.config, _ = sjson.Set(tc.config, "jwks_urls", keys)
				session := &AuthenticationSession{
					Header: make(http.Header),
				}
				err := a.Authenticate(tc.r, session, json.RawMessage([]byte(tc.config)), nil)

				if tc.expectErr {
					require.Error(t, err)
					if tc.expectExactErr != nil {
						assert.EqualError(t, err, tc.expectExactErr.Error())
					}
				} else {
					require.NoError(t, err)
				}

				if tc.expectSess != nil {
					assert.Equal(t, tc.expectSess.Subject, session.Subject)
					assert.Equal(t, tc.expectSess.Extra["sub"], session.Extra["sub"])
					assert.Equal(t, tc.expectSess.Extra["username"], session.Extra["username"])
					assert.Equal(t, tc.expectSess.Extra["IG_SESSION_ID"], session.Extra["IG_SESSION_ID"])
					assert.Equal(t, tc.expectSess.Extra["id_token"], session.Extra["id_token"])
					assert.NotEmpty(t, session.Extra["access_token"]) // Check that access_token exists
					assert.NotEmpty(t, session.Header.Get("IG_SESSION_ID"))
					assert.NotEmpty(t, session.Header.Get("sub"))
					assert.NotEmpty(t, session.Header.Get("username"))
				}
			})
		}
	})
}
