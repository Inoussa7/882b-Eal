const express = require('express');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const app = express();

// Connection URL and database name
const url = 'mongodb://localhost:27017';
const dbName = 'eslLearningApp';

// Create a new MongoClient and connect to the MongoDB server
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect((err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  console.log('Connected successfully to MongoDB');

  // Access the database
  const db = client.db(dbName);

  // Read the JSON file
  const jsonData = JSON.parse(fs.readFileSync('eaL.json', 'utf8'));

  // Insert users
  db.collection('users').insertMany(jsonData.users, (err, result) => {
    if (err) {
      console.error('Error inserting users:', err);
    } else {
      console.log('Users inserted successfully');
    }
  });

  // Insert language learning content
  Object.entries(jsonData.languageLearningContent).forEach(([topic, content]) => {
    Object.entries(content).forEach(([proficiencyLevel, data]) => {
      db.collection('languageLearningContent').insertOne({
        topic,
        proficiencyLevel,
        writingPrompt: data.WritingPrompt,
        vocabularyExercise: data.VocabularyExercise
      }, (err, result) => {
        if (err) {
          console.error('Error inserting language learning content:', err);
        } else {
          console.log('Language learning content inserted successfully');
        }
      });
    });
  });

  // Insert grammar learning content
  Object.entries(jsonData.grammarLearningContent).forEach(([topic, content]) => {
    Object.entries(content).forEach(([proficiencyLevel, data]) => {
      db.collection('grammarLearningContent').insertOne({
        topic,
        proficiencyLevel,
        explanation: data.Explanation,
        exercise: data.Exercise
      }, (err, result) => {
        if (err) {
          console.error('Error inserting grammar learning content:', err);
        } else {
          console.log('Grammar learning content inserted successfully');
        }
      });
    });
  });

  // Insert travel resources
  Object.entries(jsonData.travelResourcesForLearningStyles).forEach(([learningStyle, resources]) => {
    Object.entries(resources).forEach(([resourceType, description]) => {
      db.collection('travelResources').insertOne({
        learningStyle,
        resourceType,
        description
      }, (err, result) => {
        if (err) {
          console.error('Error inserting travel resources:', err);
        } else {
          console.log('Travel resources inserted successfully');
        }
      });
    });
  });

  // Serve static files from the 'public' directory
  app.use(express.static('public'));

  // Define routes and perform database operations
  // ...

  // Start the server
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});

// Define routes to serve the data to the client
app.get('/api/data', (req, res) => {
  // Retrieve data from the database and send it as JSON response
  db.collection('users').find().toArray((err, users) => {
    if (err) {
      console.error('Error retrieving users:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    db.collection('languageLearningContent').find().toArray((err, languageLearningContent) => {
      if (err) {
        console.error('Error retrieving language learning content:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      db.collection('grammarLearningContent').find().toArray((err, grammarLearningContent) => {
        if (err) {
          console.error('Error retrieving grammar learning content:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        db.collection('travelResources').find().toArray((err, travelResources) => {
          if (err) {
            console.error('Error retrieving travel resources:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
          }

          res.json({
            users,
            languageLearningContent,
            grammarLearningContent,
            travelResources
          });
        });
      });
    });
  });
});