import dotenv from 'dotenv';

import app from './app';
import { connectDB } from './config/db';

dotenv.config();

const startServer = async (): Promise<void> => {
  await connectDB();

  const port = Number(process.env.PORT) || 5000;

  app.listen(port, () => {
    console.log(`TaskFlow API running on port ${port}`);
    console.log(`Swagger docs at http://localhost:${port}/api-docs`);
  });
};

void startServer();
