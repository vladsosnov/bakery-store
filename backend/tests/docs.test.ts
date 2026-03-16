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
    expect(response.body.paths['/api/auth/me']).toBeDefined();
    expect(response.body.paths['/api/auth/profile']).toBeDefined();
    expect(response.body.paths['/api/products']).toBeDefined();
    expect(response.body.paths['/api/products/{productId}/reviews']).toBeDefined();
    expect(response.body.paths['/api/cart']).toBeDefined();
    expect(response.body.paths['/api/cart/items']).toBeDefined();
    expect(response.body.paths['/api/cart/items/{productId}']).toBeDefined();
    expect(response.body.paths['/api/orders']).toBeDefined();
    expect(response.body.paths['/api/admin/users']).toBeDefined();
    expect(response.body.paths['/api/admin/moderators']).toBeDefined();
    expect(response.body.paths['/api/admin/moderators/{userId}']).toBeDefined();
    expect(response.body.paths['/api/admin/orders']).toBeDefined();
    expect(response.body.paths['/api/admin/orders/{orderId}/status']).toBeDefined();
  });

  it('serves Swagger UI page', async () => {
    const response = await request(app).get('/api/docs');

    expect(response.status).toBe(301);
    expect(response.headers.location).toBe('/api/docs/');
  });
});
