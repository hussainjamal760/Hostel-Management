import { cleanEnv, str, port, num } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Environment Configuration
 * Validates and exports all environment variables
 */
const env = cleanEnv(process.env, {
  // Server
  NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
  PORT: port({ default: 5000 }),

  // MongoDB
  MONGODB_URI: str(),

  // JWT
  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  JWT_ACCESS_EXPIRY: str({ default: '15m' }),
  JWT_REFRESH_EXPIRY: str({ default: '7d' }),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: str({ default: '' }),
  CLOUDINARY_API_KEY: str({ default: '' }),
  CLOUDINARY_API_SECRET: str({ default: '' }),

  // Email
  SENDGRID_API_KEY: str({ default: '' }),
  FROM_EMAIL: str({ default: 'noreply@hostelite.com' }),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: num({ default: 900000 }), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: num({ default: 100 }),

  // CORS
  CORS_ORIGIN: str({ default: 'http://localhost:5173' }),

  // Admin Seed
  ADMIN_USERNAME: str({ default: 'admin' }),
  ADMIN_PASSWORD: str({ default: 'Admin@123' }),
  ADMIN_EMAIL: str({ default: 'admin@hostelite.com' }),
});

export default env;
