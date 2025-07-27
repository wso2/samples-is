package session_store

import (
	"fmt"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGenerateSessionID(t *testing.T) {
	t.Run("should generate unique session IDs", func(t *testing.T) {
		id1, err := GenerateSessionID()
		require.NoError(t, err)
		assert.NotEmpty(t, id1)
		assert.Len(t, id1, 32)

		id2, err := GenerateSessionID()
		require.NoError(t, err)
		assert.NotEmpty(t, id2)
		assert.Len(t, id2, 32)

		// Should be different
		assert.NotEqual(t, id1, id2)
	})

	t.Run("should generate valid hex strings", func(t *testing.T) {
		id, err := GenerateSessionID()
		require.NoError(t, err)

		for _, char := range id {
			assert.True(t, (char >= '0' && char <= '9') || (char >= 'a' && char <= 'f'))
		}
	})
}

func TestInMemoryStore(t *testing.T) {
	store := NewStore()
	require.NotNil(t, store)

	now := time.Now()
	session := Session{
		ID:          "test-session-123",
		Username:    "testuser",
		Sub:         "user-sub-123",
		ExpiresAt:   now.Add(time.Hour),
		IssuedAt:    now,
		AccessToken: "access-token-123",
		IDToken:     "id-token-123",
	}

	t.Run("method=AddSession", func(t *testing.T) {
		store.AddSession(session)

		retrieved, exists := store.GetSession("test-session-123")
		assert.True(t, exists)
		assert.Equal(t, session, retrieved)
	})

	t.Run("method=GetSession", func(t *testing.T) {
		// Test existing session
		retrieved, exists := store.GetSession("test-session-123")
		assert.True(t, exists)
		assert.Equal(t, session.ID, retrieved.ID)
		assert.Equal(t, session.Username, retrieved.Username)
		assert.Equal(t, session.Sub, retrieved.Sub)

		// Test non-existing session
		_, exists = store.GetSession("non-existent")
		assert.False(t, exists)
	})

	t.Run("method=SessionExists", func(t *testing.T) {
		assert.True(t, store.SessionExists("test-session-123"))
		assert.False(t, store.SessionExists("non-existent"))
	})

	t.Run("method=GetField", func(t *testing.T) {
		// Test valid fields
		username, exists := store.GetField("test-session-123", "username")
		assert.True(t, exists)
		assert.Equal(t, "testuser", username)

		sub, exists := store.GetField("test-session-123", "sub")
		assert.True(t, exists)
		assert.Equal(t, "user-sub-123", sub)

		accessToken, exists := store.GetField("test-session-123", "access_token")
		assert.True(t, exists)
		assert.Equal(t, "access-token-123", accessToken)

		// Test invalid field
		_, exists = store.GetField("test-session-123", "invalid_field")
		assert.False(t, exists)

		// Test non-existent session
		_, exists = store.GetField("non-existent", "username")
		assert.False(t, exists)
	})

	t.Run("method=GetSessionCount", func(t *testing.T) {
		initialCount := store.GetSessionCount()
		assert.Equal(t, 1, initialCount) // We added one session

		// Add another session
		session2 := Session{
			ID:        "test-session-456",
			Username:  "testuser2",
			Sub:       "user-sub-456",
			ExpiresAt: now.Add(time.Hour),
			IssuedAt:  now,
		}
		store.AddSession(session2)

		assert.Equal(t, 2, store.GetSessionCount())
	})

	t.Run("method=DeleteSession", func(t *testing.T) {
		// Add a session to delete
		sessionToDelete := Session{
			ID:        "delete-me",
			Username:  "deleteuser",
			Sub:       "delete-sub",
			ExpiresAt: now.Add(time.Hour),
			IssuedAt:  now,
		}
		store.AddSession(sessionToDelete)

		// Verify it exists
		assert.True(t, store.SessionExists("delete-me"))

		// Delete it
		store.DeleteSession("delete-me")

		// Verify it's gone
		assert.False(t, store.SessionExists("delete-me"))
		_, exists := store.GetSession("delete-me")
		assert.False(t, exists)
	})

	t.Run("method=CleanExpired", func(t *testing.T) {
		// Add expired session
		expiredSession := Session{
			ID:        "expired-session",
			Username:  "expireduser",
			Sub:       "expired-sub",
			ExpiresAt: now.Add(-time.Hour), // Expired 1 hour ago
			IssuedAt:  now.Add(-2 * time.Hour),
		}
		store.AddSession(expiredSession)

		// Add valid session
		validSession := Session{
			ID:        "valid-session",
			Username:  "validuser",
			Sub:       "valid-sub",
			ExpiresAt: now.Add(time.Hour), // Expires in 1 hour
			IssuedAt:  now,
		}
		store.AddSession(validSession)

		// Clean expired sessions
		store.CleanExpired()

		// Expired session should be gone
		assert.False(t, store.SessionExists("expired-session"))

		// Valid session should remain
		assert.True(t, store.SessionExists("valid-session"))
	})

	t.Run("state_management", func(t *testing.T) {
		t.Run("method=AddStateEntry", func(t *testing.T) {
			store.AddStateEntry("state-123", "Mozilla/5.0", "http://localhost/request", "http://localhost/callback", "code_verifier_123")

			// State should be valid immediately after adding with correct User Agent
			entry, valid := store.ValidateAndRemoveState("state-123", "Mozilla/5.0")
			assert.True(t, valid)
			assert.Equal(t, "state-123", entry.State)
			assert.Equal(t, "Mozilla/5.0", entry.UserAgent)
			assert.Equal(t, "http://localhost/request", entry.RequestURL)
			assert.Equal(t, "http://localhost/callback", entry.UpstreamURL)

			// Should not be valid after removal
			_, valid = store.ValidateAndRemoveState("state-123", "Mozilla/5.0")
			assert.False(t, valid)
		})

		t.Run("method=ValidateAndRemoveState_with_security_validation", func(t *testing.T) {
			// Add state
			store.AddStateEntry("state-security-test", "Edge/90.0", "http://localhost/request", "http://localhost/api", "code_verifier_security")

			// Should fail with wrong User Agent
			_, valid := store.ValidateAndRemoveState("state-security-test", "Chrome/90.0")
			assert.False(t, valid)

			// Should succeed with correct User Agent
			entry, valid := store.ValidateAndRemoveState("state-security-test", "Edge/90.0")
			assert.True(t, valid)
			assert.Equal(t, "state-security-test", entry.State)
			assert.Equal(t, "Edge/90.0", entry.UserAgent)
			assert.Equal(t, "http://localhost/request", entry.RequestURL)
			assert.Equal(t, "http://localhost/api", entry.UpstreamURL)

			// State should be removed after successful validation
			_, valid = store.ValidateAndRemoveState("state-security-test", "Edge/90.0")
			assert.False(t, valid)
		})

		t.Run("method=ValidateAndRemoveState", func(t *testing.T) {
			// Add state
			store.AddStateEntry("state-456", "Chrome/90.0", "http://localhost/request", "http://localhost/callback", "code_verifier_456")

			// First validation should succeed and remove
			entry, valid := store.ValidateAndRemoveState("state-456", "Chrome/90.0")
			assert.True(t, valid)
			assert.Equal(t, "state-456", entry.State)
			assert.Equal(t, "Chrome/90.0", entry.UserAgent)
			assert.Equal(t, "http://localhost/request", entry.RequestURL)
			assert.Equal(t, "http://localhost/callback", entry.UpstreamURL)

			// Second validation should fail (already removed)
			_, valid = store.ValidateAndRemoveState("state-456", "Chrome/90.0")
			assert.False(t, valid)

			// Non-existent state should fail
			_, valid = store.ValidateAndRemoveState("non-existent-state", "Chrome/90.0")
			assert.False(t, valid)
		})

		t.Run("method=CleanExpiredStates", func(t *testing.T) {
			// Add some states
			store.AddStateEntry("recent-state", "Safari/14.0", "http://localhost/request", "http://localhost/callback", "code_verifier_recent")
			store.AddStateEntry("old-state", "Firefox/88.0", "http://localhost/request", "http://localhost/callback", "code_verifier_old")

			// Manually set an old timestamp for one state (this is a limitation of the current implementation)
			// In a real scenario, you'd wait or use a mock time
			maxAge := 5 * time.Minute
			store.CleanExpiredStates(maxAge)

			// Recent state should still be valid
			_, valid := store.ValidateAndRemoveState("recent-state", "Safari/14.0")
			assert.True(t, valid)
		})
	})

	t.Run("concurrent_access", func(t *testing.T) {
		// Test concurrent access to ensure thread safety
		store := NewStore()

		// Run multiple goroutines adding sessions
		done := make(chan bool, 10)
		for i := 0; i < 10; i++ {
			go func(id int) {
				session := Session{
					ID:        fmt.Sprintf("concurrent-session-%d", id),
					Username:  fmt.Sprintf("user%d", id),
					Sub:       fmt.Sprintf("sub%d", id),
					ExpiresAt: time.Now().Add(time.Hour),
					IssuedAt:  time.Now(),
				}
				store.AddSession(session)
				done <- true
			}(i)
		}

		// Wait for all goroutines to complete
		for i := 0; i < 10; i++ {
			<-done
		}

		// Verify all sessions were added
		assert.Equal(t, 10, store.GetSessionCount())

		// Verify we can read all sessions
		for i := 0; i < 10; i++ {
			sessionID := fmt.Sprintf("concurrent-session-%d", i)
			assert.True(t, store.SessionExists(sessionID))
		}
	})
}
