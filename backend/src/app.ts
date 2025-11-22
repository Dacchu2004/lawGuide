// src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './config/db'; // Prisma import
import authRoutes from './routes/auth';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Default route
app.get('/', (req, res) => {
  res.send('Backend running 🚀');
});

// Test database connection route
app.get('/test-db', async (req, res) => {
  try {
    const users = await prisma.user.findMany(); // Fetch users
    res.json({ message: 'DB connected successfully 🚀', users });
  } catch (error) {
    console.error('DB Test Error:', error);
    res.status(500).json({ message: 'DB connection error ❌' });
  }
});

//Auth routes
app.use('/api/auth',authRoutes);

export default app;
