# Session Store Plugin System

The session store system in Oathkeeper has been redesigned with a **plugin-style architecture** that allows easy extension with new database backends without modifying core code.

## 🏗️ Architecture Overview

The system uses a **registry pattern** where session store implementations register themselves at startup:

```go
// Built-in stores register automatically
func init() {
    RegisterStore("memory", memoryStoreFactory)
    RegisterStore("redis", redisStoreFactory)
}
```

## 📦 Built-in Store Types

### 1. Memory Store (`memory`)
- **Storage**: In-memory Go maps
- **Persistence**: None (data lost on restart)
- **Performance**: Fastest
- **Use Case**: Development, testing, single-instance deployments

```yaml
session_store:
  type: memory
  config: {}  # No configuration needed
```

### 2. Redis Store (`redis`)
- **Storage**: External Redis database
- **Persistence**: Survives restarts
- **Performance**: Network latency overhead
- **Use Case**: Production, multi-instance deployments

```yaml
session_store:
  type: redis
  config:
    addr: "127.0.0.1:6379"
    password: ""
    db: 0
    session_prefix: "session:"
    state_prefix: "state:"
    ttl: "24h"
```

## 🔧 Creating Custom Store Implementations

### Step 1: Implement the SessionStorer Interface

```go
package mystore

import "github.com/ory/oathkeeper/pipeline/session_store"

type MyCustomStore struct {
    // Your implementation fields
}

// Implement all SessionStorer methods
func (m *MyCustomStore) AddSession(sess session_store.Session) {
    // Your implementation
}

func (m *MyCustomStore) GetSession(id string) (session_store.Session, bool) {
    // Your implementation
}

// ... implement all other methods
```

### Step 2: Register Your Store

```go
package mystore

import "github.com/ory/oathkeeper/pipeline/session_store"

func init() {
    session_store.RegisterStore("mystore", func(config map[string]interface{}) (session_store.SessionStorer, error) {
        // Parse your configuration
        myConfig, err := parseMyConfig(config)
        if err != nil {
            return nil, err
        }
        
        // Create and return your store
        return NewMyCustomStore(myConfig)
    })
}
```

### Step 3: Use Your Store

```yaml
session_store:
  type: mystore
  config:
    # Your custom configuration
    connection_string: "mydb://localhost:5432/mydb"
    custom_option: "value"
```

## 🚀 Example: MongoDB Store Implementation

Here's a complete example of implementing a MongoDB session store:

```go
package mongodb_store

import (
    "context"
    "time"
    
    "github.com/ory/oathkeeper/pipeline/session_store"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

type MongoStore struct {
    client     *mongo.Client
    database   string
    collection string
}

func NewMongoStore(uri, database, collection string) (*MongoStore, error) {
    client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(uri))
    if err != nil {
        return nil, err
    }
    
    return &MongoStore{
        client:     client,
        database:   database,
        collection: collection,
    }, nil
}

func (m *MongoStore) AddSession(sess session_store.Session) {
    collection := m.client.Database(m.database).Collection(m.collection)
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    
    _, err := collection.InsertOne(ctx, sess)
    if err != nil {
        // Handle error
    }
}

// ... implement other methods

// Register the store
func init() {
    session_store.RegisterStore("mongodb", func(config map[string]interface{}) (session_store.SessionStorer, error) {
        uri, _ := config["uri"].(string)
        database, _ := config["database"].(string)
        collection, _ := config["collection"].(string)
        
        if uri == "" {
            return nil, fmt.Errorf("uri is required for MongoDB store")
        }
        
        return NewMongoStore(uri, database, collection)
    })
}
```

## 📋 Configuration Examples

### Development Setup (Memory)
```yaml
session_store:
  type: memory
```

### Production Setup (Redis)
```yaml
session_store:
  type: redis
  config:
    addr: "redis-cluster.example.com:6379"
    password: "your-redis-password"
    db: 1
    session_prefix: "oathkeeper:session:"
    state_prefix: "oathkeeper:state:"
    ttl: "24h"
```

## 🔍 Debugging and Monitoring

### List Available Stores
```go
stores := session_store.GetRegisteredStores()
fmt.Printf("Available stores: %v\n", stores)
```

### Store Metrics
All stores implement common metrics methods:
- `GetSessionCount()` - Number of active sessions
- `SessionExists(id)` - Check if session exists
- `CleanExpired()` - Remove expired sessions

## 🛡️ Security Considerations

1. **State Validation**: All stores implement User-Agent validation for CSRF protection
2. **Expiration**: Sessions automatically expire based on `ExpiresAt` field
3. **One-Time Use**: OAuth2 states are removed after validation
4. **Thread Safety**: All implementations are thread-safe

## 🧪 Testing Your Store

```go
func TestMyStore(t *testing.T) {
    config := session_store.StoreConfig{
        Type: "mystore",
        Config: map[string]interface{}{
            "connection": "mydb://localhost",
        },
    }
    
    store, err := session_store.InitializeSessionStore(config)
    require.NoError(t, err)
    
    // Test session operations
    sess := session_store.Session{
        ID:        "test-session",
        Username:  "testuser",
        ExpiresAt: time.Now().Add(time.Hour),
    }
    
    store.AddSession(sess)
    retrieved, exists := store.GetSession("test-session")
    assert.True(t, exists)
    assert.Equal(t, sess.ID, retrieved.ID)
}
```

## 🚀 Benefits of Plugin System

1. **Zero Core Modifications**: Add new stores without changing factory code
2. **Type Safety**: All stores implement the same interface
3. **Configuration Flexibility**: Each store defines its own config structure
4. **Easy Testing**: Mock stores can be registered for testing
5. **Runtime Discovery**: List available stores dynamically
6. **Backward Compatibility**: Existing configurations continue to work

The plugin system makes the session store truly extensible while maintaining clean separation of concerns and type safety! 🎯
