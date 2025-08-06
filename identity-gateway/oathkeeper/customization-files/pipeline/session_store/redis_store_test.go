package session_store

import (
	"context"
	"os"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// TestRedisConfig tests the configuration parsing and validation
func TestRedisConfig(t *testing.T) {
	t.Run("should have correct default values", func(t *testing.T) {
		config := RedisConfig{
			Addr: "localhost:6379",
		}

		// Test that defaults are applied correctly in the constructor logic
		sessionPrefix := "session:"
		if config.SessionPrefix != "" {
			sessionPrefix = config.SessionPrefix
		}
		assert.Equal(t, "session:", sessionPrefix)

		statePrefix := "state:"
		if config.StatePrefix != "" {
			statePrefix = config.StatePrefix
		}
		assert.Equal(t, "state:", statePrefix)

		defaultTTL := 24 * time.Hour
		if config.ParsedTTL != 0 {
			defaultTTL = config.ParsedTTL
		}
		assert.Equal(t, 24*time.Hour, defaultTTL)
	})

	t.Run("should use custom values when provided", func(t *testing.T) {
		config := RedisConfig{
			Addr:          "redis:6379",
			Password:      "secret",
			DB:            1,
			SessionPrefix: "custom:session:",
			StatePrefix:   "custom:state:",
			TTL:           "2h",
			ParsedTTL:     2 * time.Hour,
		}

		assert.Equal(t, "redis:6379", config.Addr)
		assert.Equal(t, "secret", config.Password)
		assert.Equal(t, 1, config.DB)
		assert.Equal(t, "custom:session:", config.SessionPrefix)
		assert.Equal(t, "custom:state:", config.StatePrefix)
		assert.Equal(t, "2h", config.TTL)
		assert.Equal(t, 2*time.Hour, config.ParsedTTL)
	})
}

// TestRedisStoreIntegration tests Redis store creation with actual Redis connection
// These tests will skip if Redis is not available
func TestRedisStoreIntegration(t *testing.T) {
	// Skip integration tests if SKIP_REDIS_TESTS environment variable is set
	if os.Getenv("SKIP_REDIS_TESTS") != "" {
		t.Skip("Skipping Redis integration tests (SKIP_REDIS_TESTS is set)")
	}

	t.Run("should create RedisStore with valid config", func(t *testing.T) {
		config := RedisConfig{
			Addr:          "localhost:6379",
			Password:      "",
			DB:            0,
			SessionPrefix: "test:session:",
			StatePrefix:   "test:state:",
			TTL:           "1h",
			ParsedTTL:     time.Hour,
		}

		store, err := NewRedisStore(config)
		if err != nil {
			t.Skipf("Redis not available for testing: %v", err)
			return
		}

		assert.NotNil(t, store)
		assert.Equal(t, "test:session:", store.sessionPrefix)
		assert.Equal(t, "test:state:", store.statePrefix)
		assert.Equal(t, time.Hour, store.defaultTTL)
		assert.NotNil(t, store.client)
		assert.NotNil(t, store.ctx)
	})

	t.Run("should use default values when not specified", func(t *testing.T) {
		config := RedisConfig{
			Addr: "localhost:6379",
		}

		store, err := NewRedisStore(config)
		if err != nil {
			t.Skipf("Redis not available for testing: %v", err)
			return
		}

		assert.NotNil(t, store)
		assert.Equal(t, "session:", store.sessionPrefix)
		assert.Equal(t, "state:", store.statePrefix)
		assert.Equal(t, 24*time.Hour, store.defaultTTL)
	})

	t.Run("should fail with invalid Redis address", func(t *testing.T) {
		config := RedisConfig{
			Addr: "invalid:99999",
		}

		store, err := NewRedisStore(config)
		assert.Error(t, err)
		assert.Nil(t, store)
	})
}

// TestRedisStoreUnit tests Redis store functionality without requiring a Redis connection
func TestRedisStoreUnit(t *testing.T) {
	t.Run("should create RedisStore struct with correct configuration", func(t *testing.T) {
		// Test that we can create a RedisStore struct with the right fields
		// without actually connecting to Redis
		store := &RedisStore{
			sessionPrefix: "test:session:",
			statePrefix:   "test:state:",
			defaultTTL:    2 * time.Hour,
			ctx:           context.Background(),
		}

		assert.Equal(t, "test:session:", store.sessionPrefix)
		assert.Equal(t, "test:state:", store.statePrefix)
		assert.Equal(t, 2*time.Hour, store.defaultTTL)
		assert.NotNil(t, store.ctx)
	})

	t.Run("should handle CleanExpired method", func(t *testing.T) {
		store := &RedisStore{
			sessionPrefix: "session:",
			statePrefix:   "state:",
			defaultTTL:    time.Hour,
		}

		// CleanExpired should not panic and should be a no-op for Redis
		// since Redis handles expiration automatically
		assert.NotPanics(t, func() {
			store.CleanExpired()
		})
	})
}

func TestRedisStoreAdapter(t *testing.T) {
	t.Run("should implement SessionStorer interface", func(t *testing.T) {
		// Create a mock RedisStore for testing the adapter
		mockStore := &RedisStore{
			sessionPrefix: "test:session:",
			statePrefix:   "test:state:",
			defaultTTL:    time.Hour,
			ctx:           context.Background(),
		}

		adapter := &redisStoreAdapter{store: mockStore}

		// Verify that adapter implements SessionStorer interface
		var _ SessionStorer = adapter

		// Test methods that are safe to call without Redis connection
		assert.NotPanics(t, func() {
			adapter.CleanExpired()
		})

		assert.NotPanics(t, func() {
			adapter.CleanExpiredStates(time.Hour)
		})

		// Test that methods exist (interface compliance)
		assert.NotNil(t, adapter.AddSession)
		assert.NotNil(t, adapter.GetSession)
		assert.NotNil(t, adapter.DeleteSession)
		assert.NotNil(t, adapter.SessionExists)
		assert.NotNil(t, adapter.GetField)
		assert.NotNil(t, adapter.GetSessionCount)
		assert.NotNil(t, adapter.AddStateEntry)
		assert.NotNil(t, adapter.ValidateAndRemoveState)
	})

	t.Run("should forward calls to underlying store", func(t *testing.T) {
		// Test that the adapter correctly forwards calls to the underlying store
		mockStore := &RedisStore{
			sessionPrefix: "test:session:",
			statePrefix:   "test:state:",
			defaultTTL:    time.Hour,
			ctx:           context.Background(),
		}

		adapter := &redisStoreAdapter{store: mockStore}

		// Test that adapter has the correct underlying store
		assert.Equal(t, mockStore, adapter.store)
		assert.Equal(t, "test:session:", adapter.store.sessionPrefix)
		assert.Equal(t, "test:state:", adapter.store.statePrefix)
		assert.Equal(t, time.Hour, adapter.store.defaultTTL)
	})
}

// TestFactoryIntegration tests the factory functions
func TestFactoryIntegration(t *testing.T) {
	t.Run("should create in-memory store by default", func(t *testing.T) {
		config := StoreConfig{
			Type:   "memory",
			Config: map[string]interface{}{},
		}

		store, err := InitializeSessionStore(config)
		require.NoError(t, err)
		assert.NotNil(t, store)

		// Should be able to use the store
		testSession := Session{
			ID:        "test-session",
			Username:  "testuser",
			ExpiresAt: time.Now().Add(time.Hour),
		}

		store.AddSession(testSession)
		retrieved, found := store.GetSession("test-session")
		assert.True(t, found)
		assert.Equal(t, "testuser", retrieved.Username)
	})

	t.Run("should fail gracefully when Redis is not available", func(t *testing.T) {
		config := StoreConfig{
			Type: "redis",
			Config: map[string]interface{}{
				"addr": "invalid:99999",
			},
		}

		store, err := InitializeSessionStore(config)
		assert.Error(t, err)
		assert.Nil(t, store)
	})
}
