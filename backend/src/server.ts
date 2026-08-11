import 'dotenv/config';
import { env } from './utils/envConfig.js';
import app from './app.js';

process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});


(() => {

})();

const server = app.listen(env.PORT, () => {
  console.log(` Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Gracefully shutting down...');
  server.close(() => {
    console.log('Process terminated.');
  });
});
