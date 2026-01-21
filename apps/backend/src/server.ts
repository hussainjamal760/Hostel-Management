import { createApp } from './app';
import { connectDB, disconnectDB, env, logger } from './config';
import { authService } from './modules/auth';

/**
 * Server Bootstrap
 */
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDB();

    // Seed admin user
    await authService.seedAdmin();

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
      logger.info(`📚 API docs: http://localhost:${env.PORT}/api/v1/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        logger.info('HTTP server closed');
        await disconnectDB();
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Rejection:', reason);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
