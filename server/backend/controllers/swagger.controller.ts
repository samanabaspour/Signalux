import { Router, Request, Response } from 'express';

export const swaggerRouter = Router();

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Signalux Backend Core API',
    version: '1.0.0',
    description: 'API documentation for Signalux Production Core (Auth, Users, RBAC, Health & Audit)',
  },
  servers: [
    { url: '/api/v1', description: 'Production API v1 Base' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Check API and Database Health Status',
        responses: {
          200: { description: 'System healthy' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Authenticate user with Email & Password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'admin@signalux.ir' },
                  password: { type: 'string', example: '<set-a-new-admin-password>' },
                },
                required: ['email', 'password'],
              },
            },
          },
        },
        responses: {
          200: { description: 'Authenticated successfully returning JWT access & refresh tokens' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/auth/refresh': {
      post: {
        summary: 'Rotate Refresh Token and obtain new Access Token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  refreshToken: { type: 'string' },
                },
                required: ['refreshToken'],
              },
            },
          },
        },
        responses: {
          200: { description: 'Tokens rotated successfully' },
        },
      },
    },
    '/auth/me': {
      get: {
        summary: 'Get details of currently authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Current authenticated user profile & permissions' },
        },
      },
    },
    '/users': {
      get: {
        summary: 'List users with pagination (Requires users.view permission)',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'List of users' } },
      },
      post: {
        summary: 'Create a new user account (Requires users.create permission)',
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: 'User created' } },
      },
    },
  },
};

swaggerRouter.get('/docs.json', (req: Request, res: Response) => {
  res.json(swaggerSpec);
});

swaggerRouter.get('/docs', (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>مستندات API سیگنالوکس (Signalux OpenAPI)</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
      <style>
        body { margin: 0; padding: 0; font-family: Tahoma, sans-serif; background: #0c0a0f; color: #fff; }
        .swagger-ui .topbar { display: none; }
      </style>
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
      <script>
        SwaggerUIBundle({
          url: '/api/v1/docs.json',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [SwaggerUIBundle.presets.apis],
        });
      </script>
    </body>
    </html>
  `);
});
