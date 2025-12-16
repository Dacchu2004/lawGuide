// src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './config/db'; // Prisma import
import authRoutes from './routes/auth';
import lawsRoutes from "./routes/laws";
import aiRoutes from "./routes/ai";
import newsletterRoutes from "./routes/newsletter";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Default route
app.get('/', (req, res) => {
  res.send('Backend running 🚀');
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
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
app.use('/auth',authRoutes);

//Laws routes
app.use("/laws", lawsRoutes);

//AI routes
app.use("/ai", aiRoutes);

// Newsletter
app.use("/newsletter", newsletterRoutes);

export default app;
