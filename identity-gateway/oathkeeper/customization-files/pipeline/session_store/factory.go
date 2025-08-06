package session_store

import (
	"context"
	"fmt"
	"sync"
	"time"
)

type StoreFactory func(config map[string]interface{}) (SessionStorer, error)

var (
	storeRegistry = make(map[string]StoreFactory)
	registryMu    sync.RWMutex
)

func RegisterStore(storeType string, factory StoreFactory) {
	registryMu.Lock()
	defer registryMu.Unlock()
	storeRegistry[storeType] = factory
	fmt.Printf("SESSION_STORE: Registered store type '%s'\n", storeType)
}

func GetRegisteredStores() []string {
	registryMu.RLock()
	defer registryMu.RUnlock()

	stores := make([]string, 0, len(storeRegistry))
	for storeType := range storeRegistry {
		stores = append(stores, storeType)
	}
	return stores
}

type StoreConfig struct {
	Type   string                 `json:"type"`
	Config map[string]interface{} `json:"config,omitempty"`
}

func InitializeSessionStore(config StoreConfig) (SessionStorer, error) {
	storeType := config.Type
	if storeType == "" {
		storeType = "memory"
	}

	fmt.Printf("SESSION_STORE: Initializing session store with type: %s\n", storeType)

	registryMu.RLock()
	factory, exists := storeRegistry[storeType]
	registryMu.RUnlock()

	if !exists {
		availableStores := GetRegisteredStores()
		return nil, fmt.Errorf("unsupported session store type: %s. Available types: %v", storeType, availableStores)
	}

	store, err := factory(config.Config)
	if err != nil {
		fmt.Printf("SESSION_STORE: Failed to initialize %s store: %v\n", storeType, err)
		return nil, fmt.Errorf("failed to initialize %s store: %w", storeType, err)
	}

	fmt.Printf("SESSION_STORE: Successfully initialized %s session store\n", storeType)
	return store, nil
}

// redisStoreAdapter adapts RedisStore to the SessionStorer interface
type redisStoreAdapter struct {
	store *RedisStore
}

func (a *redisStoreAdapter) AddSession(sess Session) {
	_ = a.store.AddSession(context.Background(), sess)
}

func (a *redisStoreAdapter) GetSession(id string) (Session, bool) {
	return a.store.GetSession(id)
}

func (a *redisStoreAdapter) DeleteSession(id string) {
	a.store.DeleteSession(id)
}

func (a *redisStoreAdapter) CleanExpired() {
	a.store.CleanExpired()
}

func (a *redisStoreAdapter) GetField(id string, field string) (string, bool) {
	return a.store.GetField(id, field)
}

func (a *redisStoreAdapter) GetSessionCount() int {
	return a.store.GetSessionCount()
}

func (a *redisStoreAdapter) SessionExists(id string) bool {
	return a.store.SessionExists(id)
}

func (a *redisStoreAdapter) AddStateEntry(state string, userAgent, requestURL string, upstreamURL string, codeVerifier string) {
	a.store.AddStateEntry(state, userAgent, requestURL, upstreamURL, codeVerifier)
}

func (a *redisStoreAdapter) ValidateAndRemoveState(state string, currentUserAgent string) (StateEntry, bool) {
	entry, err := a.store.ValidateAndRemoveState(context.Background(), state, currentUserAgent)
	if err != nil {
		return StateEntry{}, false
	}
	return entry, entry.State != ""
}

func (a *redisStoreAdapter) CleanExpiredStates(maxAge time.Duration) {
	a.store.CleanExpiredStates(maxAge)
}

func init() {
	RegisterStore("memory", func(config map[string]interface{}) (SessionStorer, error) {
		return NewStore(), nil
	})

	RegisterStore("redis", func(config map[string]interface{}) (SessionStorer, error) {
		redisConfig, err := parseRedisConfig(config)
		if err != nil {
			return nil, fmt.Errorf("invalid Redis configuration: %w", err)
		}

		store, err := NewRedisStore(redisConfig)
		if err != nil {
			return nil, err
		}

		return &redisStoreAdapter{store: store}, nil
	})
}

func parseRedisConfig(config map[string]interface{}) (RedisConfig, error) {
	var redisConfig RedisConfig

	if addr, ok := config["addr"].(string); ok {
		redisConfig.Addr = addr
	} else {
		redisConfig.Addr = "127.0.0.1:6379"
	}

	if password, ok := config["password"].(string); ok {
		redisConfig.Password = password
	}

	if db, ok := config["db"].(float64); ok {
		redisConfig.DB = int(db)
	}

	if sessionPrefix, ok := config["session_prefix"].(string); ok {
		redisConfig.SessionPrefix = sessionPrefix
	}

	if statePrefix, ok := config["state_prefix"].(string); ok {
		redisConfig.StatePrefix = statePrefix
	}

	if ttl, ok := config["ttl"].(string); ok {
		redisConfig.TTL = ttl
		if parsedTTL, err := time.ParseDuration(ttl); err == nil {
			redisConfig.ParsedTTL = parsedTTL
		}
	}

	return redisConfig, nil
}
