import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions, configureCloudinary } from './config';
import { generalLimiter, errorHandler, notFoundHandler } from './middlewares';
import routes from './routes';

/**
 * Express Application Factory
 */
export const createApp = (): Application => {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors(corsOptions));

  // Rate limiting
  app.use(generalLimiter);

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logging
  app.use(morgan('dev'));

  // Configure external services
  configureCloudinary();

  // API routes
  app.use('/api/v1', routes);

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  return app;
};

export default createApp;
