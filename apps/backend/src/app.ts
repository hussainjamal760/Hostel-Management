import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions, configureCloudinary } from './config';
import { generalLimiter, errorHandler, notFoundHandler } from './middlewares';
import routes from './routes';

export const createApp = (): Application => {
  const app = express();

  app.use(helmet());
  app.use(cors(corsOptions));

  app.use(generalLimiter);

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.use(morgan('dev'));

  configureCloudinary();
  app.use('/api/v1', routes);

  app.use(notFoundHandler);

  app.use(errorHandler);

  return app;
};

export default createApp;
