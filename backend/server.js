const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const agreementRoutes = require('./routes/agreements');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/agreements', agreementRoutes);

app.get('/api/health', (req, res) => res.json({ success: true, message: 'API is healthy', data: null }));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB In-Memory Server for Demo
async function startServer() {
  let mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    await mongoose.connect(mongoUri);
    console.log(`Connected to Production MongoDB Atlas`);
  } else {
    const mongoServer = await MongoMemoryServer.create();
    mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB (In-Memory) at ${mongoUri}`);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.dir);
