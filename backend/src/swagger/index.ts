import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow API',
      version: '1.0.0',
      description: 'Task Management Application REST API',
    },
    servers: [{ url: 'http://localhost:5000', description: 'Development' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6625b3d5f2d1e18d74d20a01' },
            name: { type: 'string', example: 'Demo User' },
            email: { type: 'string', format: 'email', example: 'demo@taskflow.com' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6625b48bf2d1e18d74d20a02' },
            user: { type: 'string', example: '6625b3d5f2d1e18d74d20a01' },
            title: { type: 'string', example: 'Build REST API' },
            description: { type: 'string', example: 'Create CRUD endpoints for tasks' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            status: { type: 'string', enum: ['todo', 'in-progress', 'done'] },
            dueDate: { type: 'string', format: 'date-time', nullable: true },
            position: { type: 'number', example: 0 },
            isOverdue: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 50 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        TaskCreateInput: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', maxLength: 200 },
            description: { type: 'string', maxLength: 2000 },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            status: { type: 'string', enum: ['todo', 'in-progress', 'done'] },
            dueDate: { type: 'string', format: 'date-time', nullable: true },
            position: { type: 'number' },
          },
        },
        TaskUpdateInput: {
          type: 'object',
          properties: {
            title: { type: 'string', maxLength: 200 },
            description: { type: 'string', maxLength: 2000 },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            status: { type: 'string', enum: ['todo', 'in-progress', 'done'] },
            dueDate: { type: 'string', format: 'date-time', nullable: true },
            position: { type: 'number' },
          },
        },
        ReorderTasksInput: {
          type: 'object',
          required: ['tasks'],
          properties: {
            tasks: {
              type: 'array',
              items: {
                type: 'object',
                required: ['id', 'status', 'position'],
                properties: {
                  id: { type: 'string' },
                  status: { type: 'string', enum: ['todo', 'in-progress', 'done'] },
                  position: { type: 'number' },
                },
              },
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        CurrentUserResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
          },
        },
        TaskResponse: {
          type: 'object',
          properties: {
            task: { $ref: '#/components/schemas/Task' },
          },
        },
        TaskListResponse: {
          type: 'object',
          properties: {
            count: { type: 'number' },
            tasks: {
              type: 'array',
              items: { $ref: '#/components/schemas/Task' },
            },
          },
        },
        DashboardResponse: {
          type: 'object',
          properties: {
            stats: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                todo: { type: 'number' },
                inProgress: { type: 'number' },
                done: { type: 'number' },
                overdue: { type: 'number' },
                highPriority: { type: 'number' },
              },
            },
            recentTasks: {
              type: 'array',
              items: { $ref: '#/components/schemas/Task' },
            },
          },
        },
        MessageResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
        ValidationErrorResponse: {
          type: 'object',
          properties: {
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string' },
                  msg: { type: 'string' },
                  path: { type: 'string' },
                  location: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi };
