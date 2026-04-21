import request from 'supertest';

jest.mock('../middleware/auth.middleware', () => ({
  protect: (req: { user?: { _id: string; id: string } }, _res: unknown, next: () => void) => {
    req.user = { _id: 'user-1', id: 'user-1' };
    next();
  },
}));

jest.mock('../models/task.model', () => ({
  taskPriorities: ['low', 'medium', 'high'],
  taskStatuses: ['todo', 'in-progress', 'done'],
  Task: {
    find: jest.fn(),
    findOne: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
  },
}));

import app from '../app';
import { Task } from '../models/task.model';

const mockedTask = Task as jest.Mocked<typeof Task>;

describe('Tasks API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates and fetches tasks for the logged-in user', async () => {
    mockedTask.findOne.mockReturnValueOnce({
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue({ position: 0 }),
    } as never);
    mockedTask.create.mockResolvedValueOnce({
      _id: 'task-1',
      title: 'Ship backend',
      description: 'Complete the backend assignment',
      priority: 'high',
      status: 'todo',
      user: 'user-1',
      position: 1,
    } as never);
    mockedTask.find.mockReturnValueOnce({
      sort: jest.fn().mockResolvedValue([
        {
          _id: 'task-1',
          title: 'Ship backend',
          description: 'Complete the backend assignment',
          priority: 'high',
          status: 'todo',
        },
      ]),
    } as never);

    const createResponse = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Ship backend',
        description: 'Complete the backend assignment',
        priority: 'high',
        status: 'todo',
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.task.title).toBe('Ship backend');

    const listResponse = await request(app)
      .get('/api/tasks')
      .send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.count).toBe(1);
    expect(listResponse.body.tasks[0].title).toBe('Ship backend');
  });

  it('returns dashboard statistics', async () => {
    mockedTask.countDocuments
      .mockResolvedValueOnce(2 as never)
      .mockResolvedValueOnce(0 as never)
      .mockResolvedValueOnce(1 as never)
      .mockResolvedValueOnce(1 as never)
      .mockResolvedValueOnce(1 as never)
      .mockResolvedValueOnce(1 as never);
    mockedTask.find.mockReturnValueOnce({
      sort: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([
          { _id: 'task-2', title: 'Overdue task', status: 'todo', priority: 'high' },
        ]),
      }),
    } as never);

    const response = await request(app).get('/api/tasks/dashboard');

    expect(response.status).toBe(200);
    expect(response.body.stats).toMatchObject({
      total: 2,
      done: 1,
      overdue: 1,
      highPriority: 1,
    });
  });

  it('reorders tasks across statuses', async () => {
    mockedTask.findOneAndUpdate
      .mockResolvedValueOnce({ _id: 'task-1', status: 'done', position: 0 } as never)
      .mockResolvedValueOnce({ _id: 'task-2', status: 'todo', position: 1 } as never);
    mockedTask.find.mockReturnValueOnce({
      sort: jest.fn().mockResolvedValue([
        { _id: 'task-1', title: 'Task 1', status: 'done', position: 0 },
      ]),
    } as never);

    const reorderResponse = await request(app)
      .patch('/api/tasks/reorder')
      .send({
        tasks: [
          { id: 'task-1', status: 'done', position: 0 },
          { id: 'task-2', status: 'todo', position: 1 },
        ],
      });

    expect(reorderResponse.status).toBe(200);

    const doneTasksResponse = await request(app).get('/api/tasks?status=done');

    expect(doneTasksResponse.status).toBe(200);
    expect(doneTasksResponse.body.tasks).toHaveLength(1);
    expect(doneTasksResponse.body.tasks[0]._id).toBe('task-1');
  });
});
