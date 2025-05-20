const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'kvstore.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

let store = {};
try {
  if (fs.existsSync(dataFile)) {
    const data = fs.readFileSync(dataFile, 'utf8');
    store = JSON.parse(data);
    console.log('Data loaded from file');
  } 
  else {
    fs.writeFileSync(dataFile, JSON.stringify(store), 'utf8');
    console.log('Created new data file');
  }
} 
catch (error) {
  console.error('Error initializing data store:', error);
}

// Save data to file
const saveStore = () => {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(store), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
};

// Routes

// POST 
app.post('/api/kv', (req, res) => {
  const { key, value } = req.body;
  
  if (!key || value === undefined) {
    return res.status(400).json({ error: 'Both key and value are required' });
  }
  
  store[key] = value;
  
  if (saveStore()) {
    res.status(201).json({ message: 'Stored successfully', key, value });
  } else {
    res.status(500).json({ error: 'Failed to persist data' });
  }
});

// GET 
app.get('/api/kv/:key', (req, res) => {
  const { key } = req.params;
  
  if (store.hasOwnProperty(key)) {
    res.json({ key, value: store[key] });
  } else {
    res.status(404).json({ error: 'Key not found' });
  }
});

app.get('/api/kv', (req, res) => {
  res.json({ keys: Object.keys(store) });
});

// DELETE
app.delete('/api/kv/:key', (req, res) => {
  const { key } = req.params;
  
  if (store.hasOwnProperty(key)) {
    const value = store[key];
    delete store[key];
    
    // Save to file
    if (saveStore()) {
      res.json({ message: 'Deleted successfully', key, value });
    } else {
      res.status(500).json({ error: 'Failed to persist data' });
    }
  } else {
    res.status(404).json({ error: 'Key not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Key-Value Store API running on http://localhost:${PORT}`);
});
