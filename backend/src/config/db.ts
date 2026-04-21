import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined');
    }

    const conn = await mongoose.connect(mongoUri, {
      dbName: 'taskflow',
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown MongoDB error';
    console.error(`MongoDB connection error: ${message}`);
    process.exit(1);
  }
};
