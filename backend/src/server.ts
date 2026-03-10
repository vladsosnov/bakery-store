import { createServer } from 'http';

import { app } from './app.js';
import { env } from './config/env.js';
import { connectToDatabase, disconnectFromDatabase } from './db/mongodb.js';
import { seedAdminUser } from './services/auth.service.js';
import { initChatSocketServer } from './sockets/chat.socket.js';

const startServer = async () => {
  await connectToDatabase();
  await seedAdminUser();

  const httpServer = createServer(app);
  initChatSocketServer(httpServer);

  httpServer.listen(env.PORT, () => {
    console.log(`Backend is running on port ${env.PORT}`);
  });

  const shutdown = async () => {
    httpServer.close(async () => {
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
