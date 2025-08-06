package session_store

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestPluginRegistration(t *testing.T) {
	t.Run("should list registered stores", func(t *testing.T) {
		stores := GetRegisteredStores()

		assert.Contains(t, stores, "memory")
		assert.Contains(t, stores, "redis")

	})

	t.Run("should register custom store", func(t *testing.T) {
		RegisterStore("mock", func(config map[string]interface{}) (SessionStorer, error) {
			return &mockStore{}, nil
		})

		stores := GetRegisteredStores()
		assert.Contains(t, stores, "mock")
	})
}

func TestPluginSystemConfiguration(t *testing.T) {
	t.Run("should initialize memory store", func(t *testing.T) {
		config := StoreConfig{
			Type:   "memory",
			Config: map[string]interface{}{},
		}

		store, err := InitializeSessionStore(config)
		require.NoError(t, err)
		assert.NotNil(t, store)

		// Test basic functionality
		sess := Session{
			ID:        "test-session",
			Username:  "testuser",
			Sub:       "user123",
			IssuedAt:  time.Now(),
			ExpiresAt: time.Now().Add(time.Hour),
		}

		store.AddSession(sess)
		retrieved, exists := store.GetSession("test-session")
		assert.True(t, exists)
		assert.Equal(t, sess.ID, retrieved.ID)
		assert.Equal(t, sess.Username, retrieved.Username)
	})

	t.Run("should initialize redis store with config", func(t *testing.T) {
		config := StoreConfig{
			Type: "redis",
			Config: map[string]interface{}{
				"addr":           "127.0.0.1:6379",
				"password":       "",
				"db":             float64(0),
				"session_prefix": "test:session:",
				"state_prefix":   "test:state:",
				"ttl":            "1h",
			},
		}

		store, err := InitializeSessionStore(config)
		if err != nil {
			t.Skip("Redis not available for testing")
			return
		}

		assert.NotNil(t, store)

		sess := Session{
			ID:        "redis-test-session",
			Username:  "redisuser",
			Sub:       "redis123",
			IssuedAt:  time.Now(),
			ExpiresAt: time.Now().Add(time.Hour),
		}

		store.AddSession(sess)
		retrieved, exists := store.GetSession("redis-test-session")
		assert.True(t, exists)
		assert.Equal(t, sess.ID, retrieved.ID)
		assert.Equal(t, sess.Username, retrieved.Username)

		// Cleanup
		store.DeleteSession("redis-test-session")
	})

	t.Run("should fail with unsupported store type", func(t *testing.T) {
		config := StoreConfig{
			Type:   "unsupported",
			Config: map[string]interface{}{},
		}

		store, err := InitializeSessionStore(config)
		assert.Error(t, err)
		assert.Nil(t, store)
		assert.Contains(t, err.Error(), "unsupported session store type")
	})
}

func TestCustomStoreImplementation(t *testing.T) {
	RegisterStore("file", func(config map[string]interface{}) (SessionStorer, error) {
		return &fileStore{
			sessions: make(map[string]Session),
			states:   make(map[string]StateEntry),
		}, nil
	})

	t.Run("should use custom file store", func(t *testing.T) {
		config := StoreConfig{
			Type:   "file",
			Config: map[string]interface{}{},
		}

		store, err := InitializeSessionStore(config)
		require.NoError(t, err)
		assert.NotNil(t, store)

		_, isFileStore := store.(*fileStore)
		assert.True(t, isFileStore)

		sess := Session{
			ID:        "file-test-session",
			Username:  "fileuser",
			Sub:       "file123",
			IssuedAt:  time.Now(),
			ExpiresAt: time.Now().Add(time.Hour),
		}

		store.AddSession(sess)
		retrieved, exists := store.GetSession("file-test-session")
		assert.True(t, exists)
		assert.Equal(t, sess.ID, retrieved.ID)
	})
}
func TestStateManagementAcrossStores(t *testing.T) {
	storeTypes := []string{"memory"}

	if _, err := InitializeSessionStore(StoreConfig{
		Type: "redis",
		Config: map[string]interface{}{
			"addr": "127.0.0.1:6379",
		},
	}); err == nil {
		storeTypes = append(storeTypes, "redis")
	}

	for _, storeType := range storeTypes {
		t.Run("state_management_"+storeType, func(t *testing.T) {
			config := StoreConfig{
				Type: storeType,
				Config: map[string]interface{}{
					"addr": "127.0.0.1:6379",
				},
			}

			store, err := InitializeSessionStore(config)
			require.NoError(t, err)

			store.AddStateEntry("test-state", "Mozilla/5.0", "http://localhost/request", "http://localhost/callback", "123456789")

			entry, valid := store.ValidateAndRemoveState("test-state", "Mozilla/5.0")
			assert.True(t, valid)
			assert.Equal(t, "test-state", entry.State)
			assert.Equal(t, "Mozilla/5.0", entry.UserAgent)
			assert.Equal(t, "http://localhost/request", entry.RequestURL)
			assert.Equal(t, "http://localhost/callback", entry.UpstreamURL)

			_, valid = store.ValidateAndRemoveState("test-state", "Mozilla/5.0")
			assert.False(t, valid)
		})
	}
}

type mockStore struct{}

func (m *mockStore) AddSession(sess Session)                         {}
func (m *mockStore) GetSession(id string) (Session, bool)            { return Session{}, false }
func (m *mockStore) DeleteSession(id string)                         {}
func (m *mockStore) CleanExpired()                                   {}
func (m *mockStore) GetField(id string, field string) (string, bool) { return "", false }
func (m *mockStore) GetSessionCount() int                            { return 0 }
func (m *mockStore) SessionExists(id string) bool                    { return false }
func (m *mockStore) AddStateEntry(state string, userAgent, requestURL string, upstreamURL string, codeVerifier string) {
}
func (m *mockStore) ValidateAndRemoveState(state string, currentUserAgent string) (StateEntry, bool) {
	return StateEntry{}, false
}
func (m *mockStore) CleanExpiredStates(maxAge time.Duration) {}

type fileStore struct {
	sessions map[string]Session
	states   map[string]StateEntry
}

func (f *fileStore) AddSession(sess Session) {
	f.sessions[sess.ID] = sess
}

func (f *fileStore) GetSession(id string) (Session, bool) {
	sess, ok := f.sessions[id]
	return sess, ok
}

func (f *fileStore) DeleteSession(id string) {
	delete(f.sessions, id)
}

func (f *fileStore) CleanExpired() {
	now := time.Now()
	for id, sess := range f.sessions {
		if sess.ExpiresAt.Before(now) {
			delete(f.sessions, id)
		}
	}
}

func (f *fileStore) GetField(id string, field string) (string, bool) {
	sess, ok := f.sessions[id]
	if !ok {
		return "", false
	}

	switch field {
	case "username":
		return sess.Username, true
	case "sub":
		return sess.Sub, true
	case "access_token":
		return sess.AccessToken, true
	case "id_token":
		return sess.IDToken, true
	default:
		return "", false
	}
}

func (f *fileStore) GetSessionCount() int {
	return len(f.sessions)
}

func (f *fileStore) SessionExists(id string) bool {
	_, exists := f.sessions[id]
	return exists
}

func (f *fileStore) AddStateEntry(state string, userAgent, requestURL string, upstreamURL string, codeVerifier string) {
	f.states[state] = StateEntry{
		State:        state,
		CreatedAt:    time.Now(),
		UserAgent:    userAgent,
		RequestURL:   requestURL,
		UpstreamURL:  upstreamURL,
		CodeVerifier: codeVerifier,
	}
}

func (f *fileStore) ValidateAndRemoveState(state string, currentUserAgent string) (StateEntry, bool) {
	entry, exists := f.states[state]
	if !exists {
		return StateEntry{}, false
	}

	if entry.UserAgent != currentUserAgent {
		return StateEntry{}, false
	}

	delete(f.states, state)
	return entry, true
}

func (f *fileStore) CleanExpiredStates(maxAge time.Duration) {
	now := time.Now()
	for state, entry := range f.states {
		if now.Sub(entry.CreatedAt) > maxAge {
			delete(f.states, state)
		}
	}
}
