import request from 'supertest';

jest.mock('../middleware/auth.middleware', () => ({
  protect: (req: { user?: { _id: string; id: string } }, _res: unknown, next: () => void) => {
    req.user = { _id: 'user-1', id: 'user-1' };
    next();
  },
}));

jest.mock('../models/user.model', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  },
}));

import app from '../app';
import { User } from '../models/user.model';

const mockedUser = User as jest.Mocked<typeof User>;

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers a user and returns a JWT token', async () => {
    mockedUser.findOne.mockResolvedValueOnce(null);
    mockedUser.create.mockResolvedValueOnce({
      _id: 'user-1',
      name: 'Jane Doe',
      email: 'jane@example.com',
      toJSON: () => ({
        _id: 'user-1',
        name: 'Jane Doe',
        email: 'jane@example.com',
      }),
    } as never);

    const response = await request(app).post('/api/auth/register').send({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secret123',
    });

    expect(response.status).toBe(201);
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.user).toMatchObject({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });
    expect(response.body.user.password).toBeUndefined();
  });

  it('logs in an existing user', async () => {
    mockedUser.findOne.mockReturnValueOnce({
      select: jest.fn().mockResolvedValue({
        _id: 'user-1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        comparePassword: jest.fn().mockResolvedValue(true),
        toJSON: () => ({
          _id: 'user-1',
          name: 'Jane Doe',
          email: 'jane@example.com',
        }),
      }),
    } as never);

    const response = await request(app).post('/api/auth/login').send({
      email: 'jane@example.com',
      password: 'secret123',
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.user.email).toBe('jane@example.com');
  });

  it('returns the current user for a valid token', async () => {
    mockedUser.findById.mockResolvedValueOnce({
      _id: 'user-1',
      name: 'Jane Doe',
      email: 'jane@example.com',
      toJSON: () => ({
        _id: 'user-1',
        name: 'Jane Doe',
        email: 'jane@example.com',
      }),
    } as never);

    const response = await request(app).get('/api/auth/me');

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe('jane@example.com');
  });

  it('returns a logout message for authenticated users', async () => {
    const response = await request(app).post('/api/auth/logout');

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/Logout successful/i);
  });
});
