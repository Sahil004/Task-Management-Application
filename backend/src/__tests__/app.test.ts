import request from 'supertest';

import app from '../app';

describe('App', () => {
  it('returns a health check response', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.timestamp).toEqual(expect.any(String));
  });

  it('serves the OpenAPI document', async () => {
    const response = await request(app).get('/api-docs.json');

    expect(response.status).toBe(200);
    expect(response.body.openapi).toBe('3.0.0');
    expect(response.body.components.schemas.Task).toBeDefined();
    expect(response.body.components.schemas.AuthResponse).toBeDefined();
    expect(response.body.paths['/api/auth/logout']).toBeDefined();
  });
});
