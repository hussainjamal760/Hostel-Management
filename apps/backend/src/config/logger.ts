import winston from 'winston';
import env from './env';

const { combine, timestamp, printf, colorize, errors } = winston.format;

/**
 * Custom log format
 */
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

/**
 * Winston Logger Configuration
 */
export const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  defaultMeta: { service: 'hostelite-api' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
  ],
});

// Add file transports in production
if (env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

export default logger;
