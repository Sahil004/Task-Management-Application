import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { Task } from '../models/task.model';
import { User } from '../models/user.model';

dotenv.config();

const seed = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined');
    }

    await mongoose.connect(mongoUri, { dbName: 'taskflow' });
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    const user = await User.create({
      name: 'Demo User',
      email: 'demo@taskflow.com',
      password: 'demo1234',
    });
    console.log(`Created user: ${user.email}`);

    const tasks = [
      {
        title: 'Set up project structure',
        description: 'Initialize repo and install dependencies',
        priority: 'high',
        status: 'done',
        dueDate: new Date(Date.now() - 86400000),
      },
      {
        title: 'Design database schema',
        description: 'Create Mongoose models for User and Task',
        priority: 'high',
        status: 'done',
      },
      {
        title: 'Implement authentication',
        description: 'JWT register/login/me flow',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 86400000),
      },
      {
        title: 'Build REST API',
        description: 'CRUD endpoints for tasks',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 172800000),
      },
      {
        title: 'Create React frontend',
        description: 'Dashboard, task list and Kanban board',
        priority: 'medium',
        status: 'todo',
        dueDate: new Date(Date.now() + 259200000),
      },
      {
        title: 'Add drag-and-drop Kanban',
        description: 'Support board reordering',
        priority: 'medium',
        status: 'todo',
      },
      {
        title: 'Write documentation',
        description: 'README, API docs and architecture notes',
        priority: 'low',
        status: 'todo',
        dueDate: new Date(Date.now() - 3600000),
      },
      {
        title: 'Dockerize application',
        description: 'Add one-command local startup',
        priority: 'low',
        status: 'todo',
      },
    ];

    await Task.insertMany(tasks.map((task, index) => ({ ...task, user: user._id, position: index })));
    console.log(`Created ${tasks.length} demo tasks`);
    console.log('Seed complete');
    console.log('Email: demo@taskflow.com');
    console.log('Password: demo1234');
  } catch (error) {
    console.error('Seed error:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

void seed();
