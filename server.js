const express = require('express');
const client = require('./dataConnection');

const app = express();
const port = 3000;

app.get('/api/data', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('eaLdata');
    const languageLearningContent = await database.collection('languageLearningContent').find().toArray();
    const grammarLearningContent = await database.collection('grammarLearningContent').find().toArray();
    const learningStyles = await database.collection('learningStyles').find().toArray();
    const travelResourcesForLearningStyles = await database.collection('travelResourcesForLearningStyles').find().toArray();
    const proficiencyLevels = await database.collection('proficiencyLevels').find().toArray();

    res.json({
      languageLearningContent,
      grammarLearningContent,
      learningStyles,
      travelResourcesForLearningStyles,
      proficiencyLevels,
    });
  } catch (error) {
    console.error('Error fetching data from the database:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
});

app.get('/api/content', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('eaLdata');
    const lessons = await database.collection('Lessons').find().toArray();
    const users = await database.collection('users').find().toArray();

    res.json({ lessons, users });
  } catch (error) {
    console.error('Error fetching content from the database:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});