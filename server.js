const express = require('express');
const app = express();
const port = 3000;
const { client, connectToDatabase } = require('./database');

// Connect to MongoDB
connectToDatabase();

app.get('/api/content', async (req, res) => {
  try {
    const database = client.db('eaLdata');
    const lessons = await database.collection('Lessons').find().toArray();
    const users = await database.collection('users').find().toArray();
    res.json({ lessons, users });
  } catch (error) {
    console.error('Error fetching content from the database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});