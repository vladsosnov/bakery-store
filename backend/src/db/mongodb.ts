import mongoose from 'mongoose';

import { env } from '../config/env.js';

let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  await mongoose.connect(env.MONGODB_URI);
  isConnected = true;
};

export const disconnectFromDatabase = async () => {
  if (!isConnected) {
    return;
  }

  await mongoose.disconnect();
  isConnected = false;
};
