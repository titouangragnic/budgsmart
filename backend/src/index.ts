import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { config, validateConfig } from './config/environment';
import { AppDataSource } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger, responseLogger } from './middleware/logger';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import transactionRoutes from './routes/transactionRoutes';
import healthRoutes from './routes/healthRoutes';

// Validate configuration
validateConfig();

const app = express();
const PORT = config.PORT;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware (development only)
app.use(requestLogger);
app.use(responseLogger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api', healthRoutes);

// Health check (deprecated - use /api/health instead)
app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use(errorHandler);

// Initialize database and start server
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });
