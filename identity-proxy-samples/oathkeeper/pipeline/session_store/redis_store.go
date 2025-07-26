package session_store

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type RedisStore struct {
	client        *redis.Client
	sessionPrefix string
	statePrefix   string
	ctx           context.Context
	defaultTTL    time.Duration
}

// CleanExpired implements SessionStorer.
func (r *RedisStore) CleanExpired() {
	// Redis automatically removes expired keys, so we don't need to manually clean them
	// This method is implemented to satisfy the SessionStorer interface
	// No action needed as Redis handles expiration automatically
}

func (r *RedisStore) CleanExpiredStates(maxAge time.Duration) {
	// Redis automatically removes expired keys, so we don't need to manually clean them
	// This method is implemented to satisfy the SessionStorer interface
	// No action needed as Redis handles expiration automatically
}

func (r *RedisStore) GetSessionCount() int {
	keys, err := r.client.Keys(r.ctx, r.sessionPrefix+"*").Result()
	if err != nil {
		return 0
	}
	return len(keys)
}

func (r *RedisStore) SessionExists(id string) bool {
	exists, err := r.client.Exists(r.ctx, r.sessionPrefix+id).Result()
	if err != nil {
		return false
	}
	return exists == 1
}

func (r *RedisStore) ValidateAndRemoveState(ctx context.Context, state string, currentUserAgent string) (StateEntry, error) {
	key := r.statePrefix + state
	data, err := r.client.Get(ctx, key).Result()
	if err == redis.Nil {
		return StateEntry{}, nil
	}
	if err != nil {
		return StateEntry{}, fmt.Errorf("redis error: %w", err)
	}

	var stateEntry StateEntry
	if err := json.Unmarshal([]byte(data), &stateEntry); err != nil {
		return StateEntry{}, fmt.Errorf("unmarshal error: %w", err)
	}

	// Validate User Agent for security
	if stateEntry.UserAgent != currentUserAgent {
		// Don't remove the state entry on User Agent mismatch for security logging
		return StateEntry{}, fmt.Errorf("User Agent mismatch: expected %s, got %s", stateEntry.UserAgent, currentUserAgent)
	}

	// All validations passed, remove the state entry
	_, err = r.client.Del(ctx, key).Result()
	if err != nil {
		return StateEntry{}, fmt.Errorf("redis delete error: %w", err)
	}

	return stateEntry, nil
}

type RedisConfig struct {
	Addr          string        `json:"addr"`
	Password      string        `json:"password"`
	DB            int           `json:"db"`
	SessionPrefix string        `json:"session_prefix"`
	StatePrefix   string        `json:"state_prefix"`
	TTL           string        `json:"ttl"`
	ParsedTTL     time.Duration `json:"-"`
}

func NewRedisStore(config RedisConfig) (*RedisStore, error) {
	fmt.Printf("SESSION_STORE: Creating Redis store with addr: %s, DB: %d\n", config.Addr, config.DB)

	client := redis.NewClient(&redis.Options{
		Addr:     config.Addr,
		Password: config.Password,
		DB:       config.DB,
	})

	ctx := context.Background()
	fmt.Printf("SESSION_STORE: Testing Redis connection...\n")
	if err := client.Ping(ctx).Err(); err != nil {
		fmt.Printf("SESSION_STORE: Redis connection test failed: %v\n", err)
		return nil, err

	}
	fmt.Printf("SESSION_STORE: Redis connection successful\n")

	sessionPrefix := "session:"
	if config.SessionPrefix != "" {
		sessionPrefix = config.SessionPrefix
	}

	statePrefix := "state:"
	if config.StatePrefix != "" {
		statePrefix = config.StatePrefix
	}

	if config.ParsedTTL == 0 {
		config.ParsedTTL = 24 * time.Hour
	}

	return &RedisStore{
		client:        client,
		sessionPrefix: sessionPrefix,
		statePrefix:   statePrefix,
		ctx:           ctx,
		defaultTTL:    config.ParsedTTL,
	}, nil
}

func (r *RedisStore) AddSession(ctx context.Context, sess Session) error {
	data, err := json.Marshal(sess)
	if err != nil {
		return fmt.Errorf("marshal error: %w", err)
	}

	ttl := time.Until(sess.ExpiresAt)
	if ttl <= 0 {
		return errors.New("session already expired")
	}

	if err := r.client.Set(ctx, r.sessionPrefix+sess.ID, data, ttl).Err(); err != nil {
		return fmt.Errorf("redis set error: %w", err)
	}
	return nil
}

func (r *RedisStore) GetSession(id string) (Session, bool) {
	var sess Session
	data, err := r.client.Get(r.ctx, r.sessionPrefix+id).Bytes()
	if err != nil {
		return sess, false
	}

	if err := json.Unmarshal(data, &sess); err != nil {
		return sess, false
	}

	return sess, true
}

func (r *RedisStore) DeleteSession(id string) {
	r.client.Del(r.ctx, r.sessionPrefix+id)
}

func (r *RedisStore) GetField(id string, field string) (string, bool) {
	sess, ok := r.GetSession(id)
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

func (r *RedisStore) AddStateEntry(state string, userAgent, requestURL string, upstreamURL string, codeVerifier string) {
	entry := StateEntry{
		State:       state,
		CreatedAt:   time.Now(),
		UserAgent:   userAgent,
		RequestURL:  requestURL,
		UpstreamURL: upstreamURL,
		CodeVerifier: codeVerifier,
	}

	data, err := json.Marshal(entry)
	if err != nil {
		return
	}

	r.client.Set(r.ctx, r.statePrefix+state, data, r.defaultTTL)
}
