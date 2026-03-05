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
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Products', description: 'Product catalog endpoints' },
    { name: 'Cart', description: 'Cart endpoints' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
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
      LoginRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email', example: 'vlad@bakery-store.local' },
          password: { type: 'string', example: 'mySecret123' }
        },
        required: ['email', 'password']
      },
      ChangePasswordRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email', example: 'vlad@bakery-store.local' }
        },
        required: ['email']
      },
      SetPasswordRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email', example: 'vlad@bakery-store.local' },
          currentPassword: { type: 'string', example: 'Bakery-u8q2ke-2026' },
          newPassword: { type: 'string', minLength: 8, example: 'myNewStrongPassword123' }
        },
        required: ['email', 'currentPassword', 'newPassword']
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
      RegisterResponse: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/UserPublic' },
          accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
        },
        required: ['user', 'accessToken']
      },
      ChangePasswordResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Temporary password generated. Use it to sign in and update password later.' },
          temporaryPassword: { type: 'string', example: 'Bakery-u8q2ke-2026' }
        },
        required: ['message', 'temporaryPassword']
      },
      SetPasswordResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Password updated successfully.' }
        },
        required: ['message']
      },
      CartItem: {
        type: 'object',
        properties: {
          productId: { type: 'string', example: '67cc3987ec8b91b8ef6fc9ea' },
          name: { type: 'string', example: 'Sourdough loaf' },
          imageUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73' },
          price: { type: 'number', example: 8 },
          quantity: { type: 'number', example: 2 },
          availableStock: { type: 'number', example: 6 },
          lineTotal: { type: 'number', example: 16 }
        },
        required: ['productId', 'name', 'imageUrl', 'price', 'quantity', 'availableStock', 'lineTotal']
      },
      CartResponse: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/CartItem' }
          },
          totalItems: { type: 'number', example: 2 },
          totalPrice: { type: 'number', example: 16 }
        },
        required: ['items', 'totalItems', 'totalPrice']
      },
      AddCartItemRequest: {
        type: 'object',
        properties: {
          productId: { type: 'string', example: '67cc3987ec8b91b8ef6fc9ea' },
          quantity: { type: 'number', example: 1 }
        },
        required: ['productId']
      },
      UpdateCartItemQuantityRequest: {
        type: 'object',
        properties: {
          quantity: { type: 'number', example: 2 }
        },
        required: ['quantity']
      },
      Product: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '67cc3987ec8b91b8ef6fc9ea' },
          name: { type: 'string', example: 'Butter croissant' },
          slug: { type: 'string', example: 'butter-croissant' },
          description: { type: 'string', example: 'Flaky laminated pastry with cultured butter.' },
          category: { type: 'string', example: 'Pastries' },
          price: { type: 'number', example: 4.5 },
          imageUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a' },
          tags: {
            type: 'array',
            items: { type: 'string' },
            example: ['Best seller']
          },
          isAvailable: { type: 'boolean', example: true },
          stock: { type: 'number', example: 30 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        },
        required: [
          '_id',
          'name',
          'slug',
          'description',
          'category',
          'price',
          'imageUrl',
          'tags',
          'isAvailable',
          'stock',
          'createdAt',
          'updatedAt'
        ]
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
                    data: { $ref: '#/components/schemas/RegisterResponse' }
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
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Sign in with email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Signed in',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/RegisterResponse' }
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
          401: {
            description: 'Invalid credentials',
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
    },
    '/api/auth/change-password': {
      post: {
        tags: ['Auth'],
        summary: 'Change password with email only (temporary password flow)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ChangePasswordRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Temporary password generated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/ChangePasswordResponse' }
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
    },
    '/api/auth/set-password': {
      post: {
        tags: ['Auth'],
        summary: 'Set own password using current password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SetPasswordRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Password updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/SetPasswordResponse' }
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
          401: {
            description: 'Invalid credentials',
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
    },
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'List available products',
        parameters: [
          {
            in: 'query',
            name: 'category',
            schema: { type: 'string' },
            description: 'Filter by category (for example: Bread)'
          },
          {
            in: 'query',
            name: 'tag',
            schema: { type: 'string' },
            description: 'Filter by tag (for example: New)'
          },
          {
            in: 'query',
            name: 'search',
            schema: { type: 'string' },
            description: 'Search in product name and description'
          }
        ],
        responses: {
          200: {
            description: 'List of currently available products',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Product' }
                    }
                  },
                  required: ['data']
                }
              }
            }
          },
          400: {
            description: 'Invalid query params',
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
    },
    '/api/cart': {
      get: {
        tags: ['Cart'],
        summary: 'Get current user cart',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User cart',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/CartResponse' }
                  },
                  required: ['data']
                }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/cart/items': {
      post: {
        tags: ['Cart'],
        summary: 'Add product to current user cart',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AddCartItemRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Updated cart',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/CartResponse' }
                  },
                  required: ['data']
                }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          404: {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          409: {
            description: 'Not enough stock',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/cart/items/{productId}': {
      patch: {
        tags: ['Cart'],
        summary: 'Update quantity for item in current user cart',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'productId',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateCartItemQuantityRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Updated cart',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/CartResponse' }
                  },
                  required: ['data']
                }
              }
            }
          },
          404: {
            description: 'Product/cart item not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          409: {
            description: 'Not enough stock',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Cart'],
        summary: 'Remove item from current user cart',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'productId',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Updated cart',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/CartResponse' }
                  },
                  required: ['data']
                }
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
