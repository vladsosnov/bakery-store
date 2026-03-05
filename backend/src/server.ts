import { app } from './app.js';
import { env } from './config/env.js';
import { connectToDatabase, disconnectFromDatabase } from './db/mongodb.js';
import { seedAdminUser } from './services/auth.service.js';

const startServer = async () => {
  await connectToDatabase();
  await seedAdminUser();

  const server = app.listen(env.PORT, () => {
    console.log(`Backend is running on port ${env.PORT}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await disconnectFromDatabase();
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

startServer().catch((error) => {
  console.error('Failed to start backend', error);
  process.exit(1);
});
