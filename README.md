# Key-Value Store REST API

A simple and efficient key-value store with a REST API interface and web UI.

## Features

- RESTful API endpoints for CRUD operations
- Built-in web interface for easy interaction
- Automated test script for API verification
- In-memory data persistence
- JSON-based data storage

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install

npm audit fix --force
```

## Running the Server

Start the server with:
```bash
npm start
```

The server will run on http://localhost:3000 by default.

## API Documentation

### Endpoints

#### Store a Key-Value Pair
- **POST** `/api/kv`
- **Body**: `{"key": "string", "value": "any"}`
- **Response**: `{"message": "Key stored successfully"}`

#### Retrieve a Value
- **GET** `/api/kv/:key`
- **Response**: `{"value": "stored_value"}`
- **Error**: `{"error": "Key not found"}` (404)

#### List All Keys
- **GET** `/api/kv`
- **Response**: `{"keys": ["key1", "key2", ...]}`

#### Delete a Key-Value Pair
- **DELETE** `/api/kv/:key`
- **Response**: `{"message": "Key deleted successfully"}`
- **Error**: `{"error": "Key not found"}` (404)

## Testing

### Using the Test Script

A comprehensive test script (`test.js`) is provided to verify API functionality:

1. Ensure the server is running
2. Run the tests:
```bash
node test.js
```

The test script performs the following checks:
1. Storing a key-value pair
2. Retrieving the stored value
3. Listing all available keys
4. Deleting a key-value pair
5. Verifying successful deletion

### Using the Web Interface

Open http://localhost:3000 in your browser to use the built-in web interface.

### Using cURL

You can also test the API using cURL commands:

```bash
# Store a key-value pair
curl -X POST http://localhost:3000/api/kv -H "Content-Type: application/json" -d '{"key":"hello","value":"world"}'

# Retrieve a value
curl http://localhost:3000/api/kv/hello

# List all keys
curl http://localhost:3000/api/kv

# Delete a key-value pair
curl -X DELETE http://localhost:3000/api/kv/hello
```

## Data Persistence

The key-value store maintains data in memory while the server is running. Data is stored in a JavaScript object, providing fast access and modification. Note that data will be cleared when the server is stopped.

## Error Handling

The API implements proper error handling:
- Returns 404 for non-existent keys
- Returns 400 for invalid requests
- Returns 500 for server errors

All error responses include a descriptive message in the format: `{"error": "error message"}`"# Key-Value-Store-REST-API" 
