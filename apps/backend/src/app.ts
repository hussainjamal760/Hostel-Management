import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions, configureCloudinary } from './config';
import { generalLimiter, errorHandler, notFoundHandler } from './middlewares';
import routes from './routes';
import cookieParser from 'cookie-parser';

export const createApp = (): Application => {
  const app = express();

  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(cookieParser());

  app.use(generalLimiter);

  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  app.use(morgan('dev'));

  configureCloudinary();
  app.use('/api/v1', routes);

  app.use(notFoundHandler);

  app.use(errorHandler);

  return app;
};

export default createApp;
