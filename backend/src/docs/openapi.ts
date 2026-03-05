import swaggerJSDoc from 'swagger-jsdoc';

const openApiDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Bakery Store Backend API',
    version: '0.1.0',
    description: 'API documentation for Bakery Store backend.'
  },
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Local development server'
    }
  ],
  tags: [
    { name: 'Health', description: 'Service health endpoints' },
    { name: 'Auth', description: 'Authentication endpoints' }
  ],
  components: {
    schemas: {
      HealthResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'ok'
          }
        },
        required: ['status']
      },
      RegisterRequest: {
        type: 'object',
        properties: {
          firstName: { type: 'string', example: 'Vlad' },
          lastName: { type: 'string', example: 'Sosnov' },
          email: { type: 'string', format: 'email', example: 'vlad@bakery-store.local' },
          password: { type: 'string', minLength: 8, example: 'mySecret123' }
        },
        required: ['firstName', 'lastName', 'email', 'password']
      },
      UserPublic: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '67cc3987ec8b91b8ef6fc9ea' },
          firstName: { type: 'string', example: 'Vlad' },
          lastName: { type: 'string', example: 'Sosnov' },
          email: { type: 'string', format: 'email', example: 'vlad@bakery-store.local' },
          role: {
            type: 'string',
            enum: ['customer', 'moderator', 'admin'],
            example: 'customer'
          }
        },
        required: ['id', 'firstName', 'lastName', 'email', 'role']
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Email is already registered' },
          code: { type: 'string', example: 'EMAIL_TAKEN' }
        },
        required: ['error']
      }
    }
  },
  paths: {
    '/api/healthcheck': {
      get: {
        tags: ['Health'],
        summary: 'Healthcheck endpoint',
        responses: {
          200: {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthResponse' }
              }
            }
          }
        }
      }
    },
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new customer account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'User created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/UserPublic' }
                  },
                  required: ['data']
                }
              }
            }
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          409: {
            description: 'Email already registered',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    }
  }
};

export const openApiSpec = swaggerJSDoc({
  definition: openApiDefinition,
  apis: []
});
