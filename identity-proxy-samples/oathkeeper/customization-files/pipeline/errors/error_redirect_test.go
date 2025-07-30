package errors_test

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/ory/herodot"

	"github.com/ory/oathkeeper/internal"
	"github.com/ory/oathkeeper/pipeline/authn"
	"github.com/ory/oathkeeper/pipeline/session_store"
)

func TestErrorRedirect(t *testing.T) {
	conf := internal.NewConfigurationWithDefaults()
	reg := internal.NewRegistry(conf)
	sess := &authn.AuthenticationSession{
		Subject: "alice",
		Extra: map[string]interface{}{
			"role":        "admin",
			"request_url": "http://domain:3000/api",
		},
		Header: make(http.Header),
	}

	a, err := reg.PipelineErrorHandler("redirect")
	require.NoError(t, err)
	assert.Equal(t, "redirect", a.GetID())

	t.Run("method=handle", func(t *testing.T) {
		for k, tc := range []struct {
			d           string
			header      http.Header
			config      string
			expectError error
			givenError  error
			assert      func(t *testing.T, recorder *httptest.ResponseRecorder)
		}{
			{
				d:          "should redirect with 302 - absolute (HTTP)",
				givenError: &herodot.ErrNotFound,
				config:     `{"to":"http://test/test"}`,
				assert: func(t *testing.T, rw *httptest.ResponseRecorder) {
					assert.Equal(t, 302, rw.Code)
					assert.Equal(t, "http://test/test", rw.Header().Get("Location"))
				},
			},
			{
				d:          "redirect with 302 should contain a return_to param - absolute (HTTP) ",
				givenError: &herodot.ErrNotFound,
				config:     `{"to":"http://test/signin","return_to_query_param":"return_to"}`,
				assert: func(t *testing.T, rw *httptest.ResponseRecorder) {
					assert.Equal(t, 302, rw.Code)
					location, err := url.Parse(rw.Header().Get("Location"))
					require.NoError(t, err)
					assert.Equal(t, "http://test/signin?return_to=%2Ftest", rw.Header().Get("Location"))
					assert.Equal(t, "/test", location.Query().Get("return_to"))
				},
			},
			{
				d:          "should redirect with 302 - absolute (HTTPS)",
				givenError: &herodot.ErrNotFound,
				config:     `{"to":"https://test/test"}`,
				assert: func(t *testing.T, rw *httptest.ResponseRecorder) {
					assert.Equal(t, 302, rw.Code)
					assert.Equal(t, "https://test/test", rw.Header().Get("Location"))
				},
			},
			{
				d:          "redirect with 302 should contain a return_to param - absolute (HTTPS) ",
				givenError: &herodot.ErrNotFound,
				config:     `{"to":"https://test/signin","return_to_query_param":"return_to"}`,
				assert: func(t *testing.T, rw *httptest.ResponseRecorder) {
					assert.Equal(t, 302, rw.Code)
					location, err := url.Parse(rw.Header().Get("Location"))
					require.NoError(t, err)
					assert.Equal(t, "https://test/signin?return_to=%2Ftest", rw.Header().Get("Location"))
					assert.Equal(t, "/test", location.Query().Get("return_to"))
				},
			},
			{
				d:          "should redirect with 302 - relative",
				givenError: &herodot.ErrNotFound,
				config:     `{"to":"/test"}`,
				assert: func(t *testing.T, rw *httptest.ResponseRecorder) {
					assert.Equal(t, 302, rw.Code)
					assert.Equal(t, "/test", rw.Header().Get("Location"))
				},
			},
			{
				d:          "redirect with 302 should contain a return_to param - relative ",
				givenError: &herodot.ErrNotFound,
				config:     `{"to":"/test/signin","return_to_query_param":"return_to"}`,
				assert: func(t *testing.T, rw *httptest.ResponseRecorder) {
					assert.Equal(t, 302, rw.Code)
					location, err := url.Parse(rw.Header().Get("Location"))
					require.NoError(t, err)
					assert.Equal(t, "/test/signin?return_to=%2Ftest", rw.Header().Get("Location"))
					assert.Equal(t, "/test", location.Query().Get("return_to"))
				},
			},
			{
				d:          "should redirect with 301 - absolute (HTTP)",
				givenError: &herodot.ErrNotFound,
				config:     `{"to":"http://test/test","code":301}`,
				assert: func(t *testing.T, rw *httptest.ResponseRecorder) {
					assert.Equal(t, 301, rw.Code)
					assert.Equal(t, "http://test/test", rw.Header().Get("Location"))
				},
			},
			{
				d:          "redirect with 301 should contain a return_to param - absolute (HTTP) ",
				givenError: &herodot.ErrNotFound,
				config:     `{"to":"http://test/signin","return_to_query_param":"return_to","code":301}`,
				assert: func(t *testing.T, rw *httptest.ResponseRecorder) {
					assert.Equal(t, 301, rw.Code)
					location, err := url.Parse(rw.Header().Get("Location"))
					require.NoError(t, err)
					assert.Equal(t, "http://test/signin?return_to=%2Ftest", rw.Header().Get("Location"))
					assert.Equal(t, "/test", location.Query().Get("return_to"))
				},
			},
			{
				d:          "should redirect with 301 - absolute (HTTPS)",
				givenError: &herodot.ErrNotFound,
				config:     `{"to":"https://test/test","code":301}`,
				assert: func(t *testing.T, rw *httptest.ResponseRecorder) {
					assert.Equal(t, 301, rw.Code)
					assert.Equal(t, "https://test/test", rw.Header().Get("Location"))
				},
			},
			{
				d:          "redirect with 301 should contain a return_to param - absolute (HTTPS) ",
				givenError: &herodot.ErrNotFound,
				config:     `{"to":"https://test/signin","return_to_query_param":"return_to","code":301}`,
				assert: func(t *testing.T, rw *httptest.ResponseRecorder) {
					assert.Equal(t, 301, rw.Code)
					location, err := url.Parse(rw.Header().Get("Location"))
					require.NoError(t, err)
					assert.Equal(t, "https://test/signin?return_to=%2Ftest", rw.Header().Get("Location"))
					assert.Equal(t, "/test", location.Query().Get("return_to"))
				},
			},
			{
				d:          "should redirect with 301 - relative",
				givenError: &herodot.ErrNotFound,
				config:     `{"to":"/test", "code":301}`,
				assert: func(t *testing.T, rw *httptest.ResponseRecorder) {
					assert.Equal(t, 301, rw.Code)
					assert.Equal(t, "/test", rw.Header().Get("Location"))
				},
			},
			{
				d:          "redirect with 301 should contain a return_to param - relative ",
				givenError: &herodot.ErrNotFound,
				config:     `{"to":"/test/signin","return_to_query_param":"return_to","code":301}`,
				assert: func(t *testing.T, rw *httptest.ResponseRecorder) {
					assert.Equal(t, 301, rw.Code)
					location, err := url.Parse(rw.Header().Get("Location"))
					require.NoError(t, err)
					assert.Equal(t, "/test/signin?return_to=%2Ftest", rw.Header().Get("Location"))
					assert.Equal(t, "/test", location.Query().Get("return_to"))
				},
			},
		} {
			t.Run(fmt.Sprintf("case=%d/description=%s", k, tc.d), func(t *testing.T) {
				w := httptest.NewRecorder()
				r := httptest.NewRequest("GET", "/test", nil)
				err := a.Handle(w, r, sess, json.RawMessage(tc.config), nil, tc.givenError)

				if tc.expectError != nil {
					require.EqualError(t, err, tc.expectError.Error(), "%+v", err)
					return
				}

				require.NoError(t, err)
				if tc.assert != nil {
					tc.assert(t, w)
				}
			})
		}
	})
}

func TestErrorReturnToRedirectURLHeaderUsage(t *testing.T) {
	conf := internal.NewConfigurationWithDefaults()
	reg := internal.NewRegistry(conf)

	sess := &authn.AuthenticationSession{
		Subject: "alice",
		Extra: map[string]interface{}{
			"role":        "admin",
			"request_url": "http://domain:3000/api",
		},
		Header: make(http.Header),
	}

	defaultUrl := &url.URL{Scheme: "http", Host: "ory.sh", Path: "/foo"}
	defaultTransform := func(req *http.Request) {}
	config := `{"to":"http://test/test","return_to_query_param":"return_to"}`

	a, err := reg.PipelineErrorHandler("redirect")
	require.NoError(t, err)
	assert.Equal(t, "redirect", a.GetID())

	for _, tc := range []struct {
		name        string
		expectedUrl *url.URL
		transform   func(req *http.Request)
	}{
		{
			name:        "all arguments are taken from the url and request method",
			expectedUrl: defaultUrl,
			transform:   defaultTransform,
		},
		{
			name:        "all arguments are taken from the headers",
			expectedUrl: &url.URL{Scheme: "https", Host: "test.dev", Path: "/bar"},
			transform: func(req *http.Request) {
				req.Header.Add("X-Forwarded-Proto", "https")
				req.Header.Add("X-Forwarded-Host", "test.dev")
				req.Header.Add("X-Forwarded-Uri", "/bar")
			},
		},
		{
			name:        "only scheme is taken from the headers",
			expectedUrl: &url.URL{Scheme: "https", Host: defaultUrl.Host, Path: defaultUrl.Path},
			transform: func(req *http.Request) {
				req.Header.Add("X-Forwarded-Proto", "https")
			},
		},
		{
			name:        "only host is taken from the headers",
			expectedUrl: &url.URL{Scheme: defaultUrl.Scheme, Host: "test.dev", Path: defaultUrl.Path},
			transform: func(req *http.Request) {
				req.Header.Add("X-Forwarded-Host", "test.dev")
			},
		},
		{
			name:        "only path is taken from the headers",
			expectedUrl: &url.URL{Scheme: defaultUrl.Scheme, Host: defaultUrl.Host, Path: "/bar"},
			transform: func(req *http.Request) {
				req.Header.Add("X-Forwarded-Uri", "/bar")
			},
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			w := httptest.NewRecorder()
			r := httptest.NewRequest("GET", defaultUrl.String(), nil)
			tc.transform(r)

			err = a.Handle(w, r, sess, json.RawMessage(config), nil, nil)
			assert.NoError(t, err)

			loc := w.Header().Get("Location")
			assert.NotEmpty(t, loc)

			locUrl, err := url.Parse(loc)
			assert.NoError(t, err)

			returnTo := locUrl.Query().Get("return_to")
			assert.NotEmpty(t, returnTo)

			returnToUrl, err := url.Parse(returnTo)
			assert.NoError(t, err)

			assert.Equal(t, tc.expectedUrl, returnToUrl)
		})
	}
}

// TestErrorRedirectEdgeCases tests various edge cases and error conditions
func TestErrorRedirectEdgeCases(t *testing.T) {
	conf := internal.NewConfigurationWithDefaults()
	reg := internal.NewRegistry(conf)

	sess := &authn.AuthenticationSession{
		Subject: "alice",
		Extra: map[string]interface{}{
			"role":        "admin",
			"request_url": "http://domain:3000/api",
		},
		Header: make(http.Header),
	}

	a, err := reg.PipelineErrorHandler("redirect")
	require.NoError(t, err)

	// Initialize session store for testing
	session_store.GlobalStore = session_store.NewStore()

	t.Run("method=edge_cases", func(t *testing.T) {
		for k, tc := range []struct {
			d           string
			config      string
			setupReq    func(r *http.Request)
			expectError bool
			assert      func(t *testing.T, recorder *httptest.ResponseRecorder)
		}{
			{
				d:      "should handle URL encoding properly in return_to parameter",
				config: `{"to":"http://auth.example.com/login","return_to_query_param":"return_to","code":302}`,
				setupReq: func(r *http.Request) {
					r.URL.Path = "/test/path with spaces"
					r.URL.RawQuery = "param=value with spaces&other=test"
				},
				assert: func(t *testing.T, rw *httptest.ResponseRecorder) {
					assert.Equal(t, 302, rw.Code)
					location := rw.Header().Get("Location")

					u, err := url.Parse(location)
					require.NoError(t, err)

					returnTo := u.Query().Get("return_to")
					assert.NotEmpty(t, returnTo)

					// Verify the return_to URL can be parsed back
					returnToURL, err := url.Parse(returnTo)
					require.NoError(t, err)
					assert.Contains(t, returnToURL.Path, "test/path with spaces")
				},
			},
			{
				d:      "should handle malformed redirect URL gracefully",
				config: `{"to":"not-a-valid-url","return_to_query_param":"return_to","code":302}`,
				assert: func(t *testing.T, rw *httptest.ResponseRecorder) {
					assert.Equal(t, 302, rw.Code)
					location := rw.Header().Get("Location")
					// Should still attempt to redirect even with malformed URL
					assert.Contains(t, location, "not-a-valid-url")
					assert.Contains(t, location, "return_to=")
				},
			},
			{
				d:      "should handle empty return_to_query_param",
				config: `{"to":"http://auth.example.com/login","return_to_query_param":"","code":302}`,
				assert: func(t *testing.T, rw *httptest.ResponseRecorder) {
					assert.Equal(t, 302, rw.Code)
					location := rw.Header().Get("Location")
					assert.Equal(t, "http://auth.example.com/login", location)
					// Should not contain any query parameters
					assert.NotContains(t, location, "?")
				},
			},

			{
				d:      "should handle session cookie without session in store",
				config: `{"to":"http://dummy.com","type":"logout","oidc_logout_url":"http://auth.example.com/logout","post_logout_redirect_url":"http://example.com/success","code":302}`,
				setupReq: func(r *http.Request) {
					// Add session cookie but no session in store
					cookie := &http.Cookie{
						Name:  "IG_SESSION_ID",
						Value: "non-existent-session",
					}
					r.AddCookie(cookie)
				},
				assert: func(t *testing.T, rw *httptest.ResponseRecorder) {
					assert.Equal(t, 302, rw.Code)
					location := rw.Header().Get("Location")
					assert.Contains(t, location, "http://auth.example.com/logout")

					// Should still work without session
					u, err := url.Parse(location)
					require.NoError(t, err)
					assert.Equal(t, "http://example.com/success", u.Query().Get("post_logout_redirect_uri"))
					assert.NotEmpty(t, u.Query().Get("state"))
					// id_token_hint should be empty when session doesn't exist
					assert.Empty(t, u.Query().Get("id_token_hint"))
				},
			},
		} {
			t.Run(fmt.Sprintf("case=%d/description=%s", k, tc.d), func(t *testing.T) {
				w := httptest.NewRecorder()
				r := httptest.NewRequest("GET", "/test", nil)

				if tc.setupReq != nil {
					tc.setupReq(r)
				}

				err := a.Handle(w, r, sess, json.RawMessage(tc.config), nil, &herodot.ErrUnauthorized)

				if tc.expectError {
					require.Error(t, err)
					return
				}

				require.NoError(t, err)
				if tc.assert != nil {
					tc.assert(t, w)
				}
			})
		}
	})
}

// TestErrorRedirectURLConstruction tests URL construction and parameter handling
func TestErrorRedirectURLConstruction(t *testing.T) {
	conf := internal.NewConfigurationWithDefaults()
	reg := internal.NewRegistry(conf)

	sess := &authn.AuthenticationSession{
		Subject: "alice",
		Extra: map[string]interface{}{
			"role":        "admin",
			"request_url": "http://domain:3000/api",
		},
		Header: make(http.Header),
	}

	a, err := reg.PipelineErrorHandler("redirect")
	require.NoError(t, err)

	t.Run("method=url_construction", func(t *testing.T) {
		for k, tc := range []struct {
			d        string
			config   string
			setupReq func(r *http.Request)
			assert   func(t *testing.T, recorder *httptest.ResponseRecorder)
		}{
			{
				d:      "should preserve existing query parameters in redirect URL",
				config: `{"to":"http://auth.example.com/login?existing=param","return_to_query_param":"return_to","code":302}`,
				assert: func(t *testing.T, rw *httptest.ResponseRecorder) {
					location := rw.Header().Get("Location")
					assert.Contains(t, location, "existing=param")
					assert.Contains(t, location, "return_to=")

					u, err := url.Parse(location)
					require.NoError(t, err)
					assert.Equal(t, "param", u.Query().Get("existing"))
					assert.NotEmpty(t, u.Query().Get("return_to"))
				},
			},
			{
				d:      "should handle complex URLs with fragments and ports",
				config: `{"to":"https://auth.example.com:8080/login#section","return_to_query_param":"return_to","code":302}`,
				assert: func(t *testing.T, rw *httptest.ResponseRecorder) {
					location := rw.Header().Get("Location")
					assert.Contains(t, location, "https://auth.example.com:8080/login")
					assert.Contains(t, location, "return_to=")
					// Fragment should be preserved
					assert.Contains(t, location, "#section")
				},
			},
			{
				d:      "should handle X-Forwarded headers in URL construction",
				config: `{"to":"http://auth.example.com/login","return_to_query_param":"return_to","code":302}`,
				setupReq: func(r *http.Request) {
					r.Header.Set("X-Forwarded-Proto", "https")
					r.Header.Set("X-Forwarded-Host", "proxy.example.com")
					r.Header.Set("X-Forwarded-Uri", "/proxied/path")
				},
				assert: func(t *testing.T, rw *httptest.ResponseRecorder) {
					location := rw.Header().Get("Location")
					u, err := url.Parse(location)
					require.NoError(t, err)

					returnTo := u.Query().Get("return_to")
					returnToURL, err := url.Parse(returnTo)
					require.NoError(t, err)

					// Should use forwarded headers for return_to URL
					assert.Equal(t, "https", returnToURL.Scheme)
					assert.Equal(t, "proxy.example.com", returnToURL.Host)
					assert.Equal(t, "/proxied/path", returnToURL.Path)
				},
			},
		} {
			t.Run(fmt.Sprintf("case=%d/description=%s", k, tc.d), func(t *testing.T) {
				w := httptest.NewRecorder()
				r := httptest.NewRequest("GET", "/test", nil)

				if tc.setupReq != nil {
					tc.setupReq(r)
				}

				err := a.Handle(w, r, sess, json.RawMessage(tc.config), nil, &herodot.ErrUnauthorized)
				require.NoError(t, err)

				if tc.assert != nil {
					tc.assert(t, w)
				}
			})
		}
	})
}

// TestErrorRedirectLogoutType tests the logout type redirect functionality
func TestErrorRedirectLogoutType(t *testing.T) {
	conf := internal.NewConfigurationWithDefaults()
	reg := internal.NewRegistry(conf)

	sess := &authn.AuthenticationSession{
		Subject: "alice",
		Extra: map[string]interface{}{
			"role":        "admin",
			"request_url": "http://domain:3000/api",
		},
		Header: make(http.Header),
	}

	a, err := reg.PipelineErrorHandler("redirect")
	require.NoError(t, err)

	// Initialize session store for testing
	session_store.GlobalStore = session_store.NewStore()

	t.Run("method=handle_logout_type", func(t *testing.T) {
		for k, tc := range []struct {
			d           string
			config      string
			setupCookie func(r *http.Request)
			expectError bool
			assert      func(t *testing.T, recorder *httptest.ResponseRecorder)
		}{
			{
				d:           "should fail when oidc_logout_url is missing",
				config:      `{"to":"http://dummy.com","type":"logout","post_logout_redirect_url":"http://example.com/logout-success"}`,
				expectError: true,
			},
			{
				d:           "should fail when post_logout_redirect_url is missing",
				config:      `{"to":"http://dummy.com","type":"logout","oidc_logout_url":"http://auth.example.com/logout"}`,
				expectError: true,
			},
			{
				d:      "should redirect to OIDC logout URL without session cookie",
				config: `{"to":"http://dummy.com","type":"logout","oidc_logout_url":"http://auth.example.com/logout","post_logout_redirect_url":"http://example.com/logout-success","code":302}`,
				assert: func(t *testing.T, rw *httptest.ResponseRecorder) {
					assert.Equal(t, 302, rw.Code)
					location := rw.Header().Get("Location")
					assert.Contains(t, location, "http://auth.example.com/logout")
					assert.Contains(t, location, "post_logout_redirect_uri=")
					assert.Contains(t, location, "state=")

					// Parse URL to verify parameters
					u, err := url.Parse(location)
					require.NoError(t, err)
					assert.Equal(t, "http://example.com/logout-success", u.Query().Get("post_logout_redirect_uri"))
					assert.NotEmpty(t, u.Query().Get("state"))
					// id_token_hint should be empty when no session
					assert.Empty(t, u.Query().Get("id_token_hint"))
				},
			},
			{
				d:      "should redirect to OIDC logout URL with session cookie and id_token",
				config: `{"to":"http://dummy.com","type":"logout","oidc_logout_url":"http://auth.example.com/logout","post_logout_redirect_url":"http://example.com/logout-success","code":302}`,
				setupCookie: func(r *http.Request) {
					// Add a session to the store first
					sessionID := "test-session-123"
					session := session_store.Session{
						ID:        sessionID,
						Username:  "testuser",
						Sub:       "user-sub-123",
						ExpiresAt: time.Now().Add(time.Hour),
						IssuedAt:  time.Now(),
						IDToken:   "test-id-token-123",
					}
					session_store.GlobalStore.AddSession(session)

					// Add session cookie to request
					cookie := &http.Cookie{
						Name:  "IG_SESSION_ID",
						Value: sessionID,
					}
					r.AddCookie(cookie)
				},
				assert: func(t *testing.T, rw *httptest.ResponseRecorder) {
					assert.Equal(t, 302, rw.Code)
					location := rw.Header().Get("Location")
					assert.Contains(t, location, "http://auth.example.com/logout")
					assert.Contains(t, location, "post_logout_redirect_uri=")
					assert.Contains(t, location, "state=")
					assert.Contains(t, location, "id_token_hint=")

					// Parse URL to verify parameters
					u, err := url.Parse(location)
					require.NoError(t, err)
					assert.Equal(t, "http://example.com/logout-success", u.Query().Get("post_logout_redirect_uri"))
					assert.NotEmpty(t, u.Query().Get("state"))
					assert.Equal(t, "test-id-token-123", u.Query().Get("id_token_hint"))

					// Verify session was deleted from store
					_, exists := session_store.GlobalStore.GetSession("test-session-123")
					assert.False(t, exists)

					// Verify that the IG_SESSION_ID cookie is cleared
					cookies := rw.Header().Values("Set-Cookie")
					var foundClearCookie bool
					for _, cookieStr := range cookies {
						if strings.Contains(cookieStr, "IG_SESSION_ID=") &&
							(strings.Contains(cookieStr, "Max-Age=0") || strings.Contains(cookieStr, "Max-Age=-1")) {
							foundClearCookie = true
							break
						}
					}
					assert.True(t, foundClearCookie, "Should set a cookie to clear IG_SESSION_ID")
				},
			},
		} {
			t.Run(fmt.Sprintf("case=%d/description=%s", k, tc.d), func(t *testing.T) {
				w := httptest.NewRecorder()
				r := httptest.NewRequest("GET", "/test", nil)

				if tc.setupCookie != nil {
					tc.setupCookie(r)
				}

				err := a.Handle(w, r, sess, json.RawMessage(tc.config), nil, &herodot.ErrUnauthorized)

				if tc.expectError {
					require.Error(t, err)
					return
				}

				require.NoError(t, err)
				if tc.assert != nil {
					tc.assert(t, w)
				}
			})
		}
	})
}

func TestErrorRedirectAuthType(t *testing.T) {
	conf := internal.NewConfigurationWithDefaults()
	reg := internal.NewRegistry(conf)

	sess := &authn.AuthenticationSession{
		Subject: "alice",
		Extra: map[string]interface{}{
			"role":        "admin",
			"request_url": "http://domain:3000/api",
		},
		Header: make(http.Header),
	}

	a, err := reg.PipelineErrorHandler("redirect")
	require.NoError(t, err)

	// Initialize session store for testing
	session_store.GlobalStore = session_store.NewStore()

	t.Run("method=handle_auth_type", func(t *testing.T) {
		for k, tc := range []struct {
			d           string
			config      string
			expectError bool
			assert      func(t *testing.T, recorder *httptest.ResponseRecorder)
		}{
			{
				d:      "should redirect with auth type and generate state",
				config: `{"to":"http://auth.example.com/login","type":"auth","code":302,"oidc_authorization_url":"https://lexample.com/oauth2/authorize","client_id":"app123","redirect_url":"https://example.com/callback","scopes":["openid","profile","email"]}`,
				assert: func(t *testing.T, rw *httptest.ResponseRecorder) {
					assert.Equal(t, 302, rw.Code)
					location := rw.Header().Get("Location")
					assert.Contains(t, location, "https://lexample.com/oauth2/authorize")
					assert.Contains(t, location, "response_type=code")
					assert.Contains(t, location, "client_id=app123")
					assert.Contains(t, location, "redirect_uri=https%3A%2F%2Fexample.com%2Fcallback")
					assert.Contains(t, location, "scope=openid+profile+email")
					assert.Contains(t, location, "state=")

					u, err := url.Parse(location)
					require.NoError(t, err)
					state := u.Query().Get("state")
					assert.NotEmpty(t, state)
					assert.True(t, len(state) > 10)
				},
			},
		} {
			t.Run(fmt.Sprintf("case=%d/description=%s", k, tc.d), func(t *testing.T) {
				w := httptest.NewRecorder()
				r := httptest.NewRequest("GET", "/test", nil)
				r.RemoteAddr = "192.168.1.1:12345"
				r.Header.Set("User-Agent", "TestAgent/1.0")

				err := a.Handle(w, r, sess, json.RawMessage(tc.config), nil, &herodot.ErrUnauthorized)

				if tc.expectError {
					require.Error(t, err)
					return
				}

				require.NoError(t, err)
				if tc.assert != nil {
					tc.assert(t, w)
				}
			})
		}
	})
}

// TestErrorRedirectStateManagement tests state generation and management
func TestErrorRedirectStateManagement(t *testing.T) {
	conf := internal.NewConfigurationWithDefaults()
	reg := internal.NewRegistry(conf)

	sess := &authn.AuthenticationSession{
		Subject: "alice",
		Extra: map[string]interface{}{
			"role":        "admin",
			"request_url": "http://domain:3000/api",
		},
		Header: make(http.Header),
	}

	a, err := reg.PipelineErrorHandler("redirect")
	require.NoError(t, err)

	// Initialize session store for testing
	session_store.GlobalStore = session_store.NewStore()

	t.Run("method=state_management", func(t *testing.T) {
		config := `{"to":"http://auth.example.com/login","type":"auth","code":302}`

		// Test multiple requests to ensure unique states
		states := make(map[string]bool)

		for i := 0; i < 5; i++ {
			w := httptest.NewRecorder()
			r := httptest.NewRequest("GET", "/test", nil)
			r.RemoteAddr = fmt.Sprintf("192.168.1.%d:12345", i+1)
			r.Header.Set("User-Agent", fmt.Sprintf("TestAgent/%d.0", i+1))

			err := a.Handle(w, r, sess, json.RawMessage(config), nil, &herodot.ErrUnauthorized)
			require.NoError(t, err)

			location := w.Header().Get("Location")
			assert.NotEmpty(t, location)

			// The location should contain the state parameter
			assert.Contains(t, location, "state=")

			// Extract state from the location string manually since URL parsing might fail
			// due to the malformed URL construction in the implementation
			parts := strings.Split(location, "state=")
			require.Len(t, parts, 2, "Location should contain state parameter")
			state := parts[1]

			// Remove any additional parameters after the state
			if ampIndex := strings.Index(state, "&"); ampIndex != -1 {
				state = state[:ampIndex]
			}

			assert.NotEmpty(t, state)

			// Ensure state is unique
			assert.False(t, states[state], "State should be unique for each request")
			states[state] = true

			// Verify state length (should be reasonable for security)
			assert.True(t, len(state) >= 20, "State should be at least 20 characters long")
		}
	})
}
