package session_store

import (
	"crypto/rand"
	"encoding/hex"
	"sync"
	"time"
)

type Session struct {
	ID           string
	Username     string
	Sub          string
	ExpiresAt    time.Time
	IssuedAt     time.Time
	AccessToken  string
	IDToken      string
	CodeVerifier string
}

type StateEntry struct {
	State        string
	CreatedAt    time.Time
	UserAgent    string
	RequestURL   string
	UpstreamURL  string
	CodeVerifier string
}

// Interface for session storage implementations
type SessionStorer interface {
	AddSession(sess Session)
	GetSession(id string) (Session, bool)
	DeleteSession(id string)
	CleanExpired()
	GetField(id string, field string) (string, bool)
	GetSessionCount() int
	SessionExists(id string) bool

	AddStateEntry(state string, userAgent, requestURL string, upstreamURL string, codeVerifier string)
	ValidateAndRemoveState(state string, currentUserAgent string) (StateEntry, bool)
	CleanExpiredStates(maxAge time.Duration)
}

type Store struct {
	mu           sync.RWMutex
	sessions     map[string]Session
	stateEntries map[string]StateEntry
}

func NewStore() *Store {
	return &Store{
		sessions:     make(map[string]Session),
		stateEntries: make(map[string]StateEntry),
	}
}

// Singleton instance of the session store
var GlobalStore SessionStorer

// Creates a new cryptographically secure random session ID
func GenerateSessionID() (string, error) {
	bytes := make([]byte, 16) // 128-bit session ID
	_, err := rand.Read(bytes)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

func (s *Store) AddSession(sess Session) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.sessions[sess.ID] = sess
}

func (s *Store) GetSession(id string) (Session, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	sess, ok := s.sessions[id]
	return sess, ok
}

func (s *Store) DeleteSession(id string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.sessions, id)
}

func (s *Store) CleanExpired() {
	s.mu.Lock()
	defer s.mu.Unlock()
	now := time.Now()
	for id, sess := range s.sessions {
		if sess.ExpiresAt.Before(now) {
			delete(s.sessions, id)
		}
	}
}

func (s *Store) GetField(id string, field string) (string, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	sess, ok := s.sessions[id]
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

func (s *Store) AddStateEntry(state string, userAgent, requestURL string, upstreamURL string, codeVerifier string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.stateEntries[state] = StateEntry{
		State:        state,
		CreatedAt:    time.Now(),
		UserAgent:    userAgent,
		RequestURL:   requestURL,
		UpstreamURL:  upstreamURL,
		CodeVerifier: codeVerifier,
	}
}

func (s *Store) ValidateAndRemoveState(state string, currentUserAgent string) (StateEntry, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()

	entry, exists := s.stateEntries[state]
	if !exists {
		return StateEntry{}, false
	}

	if entry.UserAgent != currentUserAgent {
		return StateEntry{}, false
	}

	delete(s.stateEntries, state)
	return entry, true
}

func (s *Store) CleanExpiredStates(maxAge time.Duration) {
	s.mu.Lock()
	defer s.mu.Unlock()
	now := time.Now()
	for state, entry := range s.stateEntries {
		if now.Sub(entry.CreatedAt) > maxAge {
			delete(s.stateEntries, state)
		}
	}
}

func (s *Store) GetSessionCount() int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return len(s.sessions)
}

func (s *Store) SessionExists(id string) bool {
	s.mu.RLock()
	defer s.mu.RUnlock()
	_, exists := s.sessions[id]
	return exists
}

func InitGlobalStore(config StoreConfig) error {
	store, err := InitializeSessionStore(config)
	if err != nil {
		return err
	}

	GlobalStore = store
	return nil
}

func DefaultConfig() StoreConfig {
	return StoreConfig{
		Type: "memory",
	}
}
