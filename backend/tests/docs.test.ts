import request from 'supertest';

import { app } from '../src/app.js';

describe('API docs', () => {
  it('returns OpenAPI JSON spec', async () => {
    const response = await request(app).get('/api/openapi.json');

    expect(response.status).toBe(200);
    expect(response.body.openapi).toBe('3.0.3');
    expect(response.body.paths['/api/auth/register']).toBeDefined();
    expect(response.body.paths['/api/auth/change-password']).toBeDefined();
    expect(response.body.paths['/api/auth/set-password']).toBeDefined();
    expect(response.body.paths['/api/products']).toBeDefined();
  });

  it('serves Swagger UI page', async () => {
    const response = await request(app).get('/api/docs');

    expect(response.status).toBe(301);
    expect(response.headers.location).toBe('/api/docs/');
  });
});
