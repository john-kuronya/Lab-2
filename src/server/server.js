
const express = require('express');
const cors = require('cors');

// Create the Express application.
const app = express();

const PORT = 8000;

// Allow requests from Angular.
app.use(cors({
  origin: 'http://localhost:4200'
}));

// Parse incoming JSON request bodies.
app.use(express.json());

// Sample milestone records stored in memory.
const milestones = [
  {
    id: 1,
    name: 'Create Angular Components',
    status: 'Completed'
  },
  {
    id: 2,
    name: 'Implement Reactive Forms',
    status: 'Completed'
  },
  {
    id: 3,
    name: 'Develop Express Backend',
    status: 'In Progress'
  }
];

// Respond to requests at the home URL.
app.get('/', (req, res) => {
  res.send('Project Progress Tracker API is running!');
});

// Retrieve milestone records.
app.get('/milestones', (req, res) => {
  console.log('GET request received for milestones');

  // Return milestone data as JSON.
  res.status(200).json(milestones);
});

// Receive milestone information from Angular.
app.post('/milestones', (req, res) => {
  const { name, status } = req.body;

  // Display the submitted information.
  console.log('New milestone received:');
  console.log('Name:', name);
  console.log('Status:', status);

  // Return a confirmation.
  res.status(200).json({
    message: 'Milestone received successfully!'
  });
});

// Start the server.
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
