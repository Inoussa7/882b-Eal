const express = require('express');
const app = express();
const port = 3000;

app.get('/data', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('eaLdata');
    const collection = database.collection('Lessons');
    const data = await collection.find().toArray();
    res.json(data);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});