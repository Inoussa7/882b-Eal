const express = require('express');
const app = express();
const port = 3000;
const { client, connectToDatabase } = require('./dataConnection'); 

// Function to start the server
async function startServer() {
  try {
    await connectToDatabase();
    console.log('Connected to MongoDB.');

    app.get('/api/content', async (req, res) => {
      try {
        // Now `client` is defined, so you can use it here
        const database = client.db('eaLdata');
        // Ensure collection names are correct. Case sensitivity matters in MongoDB
        const lessons = await database.collection('lessons').find().toArray(); // Changed 'Lessons' to 'lessons' if your collection name is indeed lowercase
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
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}

startServer();
