// Test script for the Key-Value Store API
const http = require('http');
const HOST = 'localhost';
const PORT = 3000;
const BASE_URL = `http://${HOST}:${PORT}/api/kv`;

// Make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: HOST,
      port: PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({ statusCode: res.statusCode, data: parsedData });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  console.log('Starting Key-Value Store API tests...');
  
  try {
    console.log('\nTest 1: Storing a key-value pair');
    const storeResult = await makeRequest('POST', '/api/kv', { key: 'test_key', value: 'test_value' });
    console.log(`Status: ${storeResult.statusCode}`);
    console.log('Response:', storeResult.data);

    console.log('\nTest 2: Retrieving the value');
    const getResult = await makeRequest('GET', '/api/kv/test_key');
    console.log(`Status: ${getResult.statusCode}`);
    console.log('Response:', getResult.data);

    console.log('\nTest 3: Listing all keys');
    const listResult = await makeRequest('GET', '/api/kv');
    console.log(`Status: ${listResult.statusCode}`);
    console.log('Response:', listResult.data);

    console.log('\nTest 4: Deleting the key-value pair');
    const deleteResult = await makeRequest('DELETE', '/api/kv/test_key');
    console.log(`Status: ${deleteResult.statusCode}`);
    console.log('Response:', deleteResult.data);

    console.log('\nTest 5: Verifying deletion');
    const verifyResult = await makeRequest('GET', '/api/kv/test_key');
    console.log(`Status: ${verifyResult.statusCode}`);
    console.log('Response:', verifyResult.data);

    console.log('\nAll tests completed!');
  } catch (error) {
    console.error('Error during tests:', error);
  }
}

// Check if server is running
const checkServer = () => {
  return new Promise((resolve) => {
    const req = http.get(`http://${HOST}:${PORT}`, (res) => {
      resolve(true);
    }).on('error', () => {
      resolve(false);
    });
    req.end();
  });
};

async function main() {
  console.log('Checking if server is running...');
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('Error: Server is not running!');
    console.log('Please start the server first with "npm start"');
    console.log('Then run this script again with "node test.js"');
    process.exit(1);
  }

  console.log('Server is running. Starting tests...');
  await runTests();
}

main();
