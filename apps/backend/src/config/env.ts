import { cleanEnv, str, port, num } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

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
  JWT_REFRESH_EXPIRY: str({ default: '30d' }),
  COOKIE_ACCESS_MAX_AGE_MS: num({ default: 15 * 60 * 1000 }), // 15m
  COOKIE_REFRESH_MAX_AGE_MS: num({ default: 30 * 24 * 60 * 60 * 1000 }), // 30d

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str(),

  // Google Cloud Console OAuth2 (Gmail)
  SMTP_USER: str(),
  GOOGLE_CLIENT_ID: str(),
  GOOGLE_CLIENT_SECRET: str(),
  GOOGLE_REFRESH_TOKEN: str(),
  FROM_EMAIL: str({ default: '' }),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: num({ default: 900000 }), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: num({ default: 500 }),

  // CORS
  CORS_ORIGIN: str({ default: 'http://localhost:5000' }),
  
  // Frontend
  FRONTEND_URL: str({ default: 'http://localhost:3000' }),

});

export default env;
