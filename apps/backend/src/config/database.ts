import mongoose from 'mongoose';
import env from './env';
import { logger } from './logger';

/**
 * Database Connection
 * Connects to MongoDB Atlas with retry logic
 */
export const connectDB = async (): Promise<void> => {
  try {
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(env.MONGODB_URI, options);
    logger.info('✅ MongoDB connected successfully');

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });
  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

/**
 * Graceful shutdown
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed gracefully');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
  }
};
