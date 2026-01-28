import { CorsOptions } from 'cors';
import env from './env';

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());

    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin) || env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Total-Pages'],
  maxAge: 86400, 
};

export default corsOptions;
