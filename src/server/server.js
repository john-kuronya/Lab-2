

const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 8000;

app.use(cors({
  origin: 'http://localhost:4200'
}));

app.use(express.json());

// MongoDB connection settings.
const mongoUri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(mongoUri);

let projectsCollection;

// Existing Lab 4 milestone records.
const milestones = [
  { id: 1, name: 'Create Angular Components', status: 'Completed' },
  { id: 2, name: 'Implement Reactive Forms', status: 'Completed' },
  { id: 3, name: 'Develop Express Backend', status: 'In Progress' }
];

// Home endpoint.
app.get('/', (req, res) => {
  res.send('Project Progress Tracker API is running!');
});

// Lab 4: GET milestones.
app.get('/milestones', (req, res) => {
  res.status(200).json(milestones);
});

// Lab 4: POST milestones.
app.post('/milestones', (req, res) => {
  const { name, status } = req.body;

  console.log('New milestone received:', name, status);

  res.status(200).json({
    message: 'Milestone received successfully!'
  });
});

// Lab 5: GET all projects.
app.get('/projects', async (req, res) => {
  try {
    const projects = await projectsCollection.find({}).toArray();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lab 5: GET one project.
app.get('/projects/:id', async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const project = await projectsCollection.findOne({ _id: id });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ error: 'Invalid project ID' });
  }
});

// Lab 5: POST create project.
app.post('/projects', async (req, res) => {
  try {
    const result = await projectsCollection.insertOne(req.body);

    res.status(201).json({
      message: 'Project created successfully',
      insertedId: result.insertedId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lab 5: PUT update project.
app.put('/projects/:id', async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);

    const result = await projectsCollection.updateOne(
      { _id: id },
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json({
      message: 'Project updated successfully'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Lab 5: DELETE project.
app.delete('/projects/:id', async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);

    const result = await projectsCollection.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json({
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Connect to MongoDB before starting Express.
async function startServer() {
  try {
    await client.connect();

    const db = client.db('project_progress_tracker');
    projectsCollection = db.collection('projects');

    console.log('Connected to MongoDB successfully!');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

startServer();

