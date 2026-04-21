import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { FilterQuery } from 'mongoose';

import { ITask, Task, TaskPriority, TaskStatus } from '../models/task.model';

type TaskSortField = 'dueDate' | 'createdAt' | 'priority' | 'title';
type SortOrder = 'asc' | 'desc';

const allowedSortFields: TaskSortField[] = ['dueDate', 'createdAt', 'priority', 'title'];

const getValidationErrors = (req: Request, res: Response): boolean => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return true;
  }

  return false;
};

export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authorised' });
      return;
    }

    const { status, priority, sortBy = 'createdAt', order = 'desc' } = req.query as {
      status?: TaskStatus;
      priority?: TaskPriority;
      sortBy?: TaskSortField;
      order?: SortOrder;
    };

    const query: FilterQuery<ITask> = { user: req.user._id };
    if (status) {
      query.status = status;
    }
    if (priority) {
      query.priority = priority;
    }

    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    const tasks = await Task.find(query).sort({ [sortField]: sortOrder, position: 1 });
    res.json({ count: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
};

export const getDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authorised' });
      return;
    }

    const userId = req.user._id;
    const now = new Date();

    const [total, todo, inProgress, done, overdue, highPriority] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, status: 'todo' }),
      Task.countDocuments({ user: userId, status: 'in-progress' }),
      Task.countDocuments({ user: userId, status: 'done' }),
      Task.countDocuments({ user: userId, status: { $ne: 'done' }, dueDate: { $lt: now } }),
      Task.countDocuments({ user: userId, priority: 'high', status: { $ne: 'done' } }),
    ]);

    const recentTasks = await Task.find({ user: userId }).sort({ createdAt: -1 }).limit(5);

    res.json({
      stats: {
        total,
        todo,
        inProgress,
        done,
        overdue,
        highPriority,
      },
      recentTasks,
    });
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authorised' });
      return;
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json({ task });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authorised' });
      return;
    }

    if (getValidationErrors(req, res)) {
      return;
    }

    const lastTask = await Task.findOne({ user: req.user._id, status: req.body.status || 'todo' })
      .sort({ position: -1 })
      .select('position');

    const task = await Task.create({
      ...req.body,
      user: req.user._id,
      position: req.body.position ?? (lastTask?.position ?? -1) + 1,
      dueDate: req.body.dueDate || null,
    });

    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authorised' });
      return;
    }

    if (getValidationErrors(req, res)) {
      return;
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        ...req.body,
        ...(req.body.dueDate === '' ? { dueDate: null } : {}),
      },
      { new: true, runValidators: true },
    );

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json({ task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authorised' });
      return;
    }

    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const reorderTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authorised' });
      return;
    }

    if (getValidationErrors(req, res)) {
      return;
    }

    const tasks = req.body.tasks as Array<{ id: string; status: TaskStatus; position: number }>;

    await Promise.all(
      tasks.map((task) =>
        Task.findOneAndUpdate(
          { _id: task.id, user: req.user!._id },
          { status: task.status, position: task.position },
          { new: true },
        ),
      ),
    );

    res.json({ message: 'Tasks reordered successfully' });
  } catch (error) {
    next(error);
  }
};
