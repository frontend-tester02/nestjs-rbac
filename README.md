# NestJS RBAC API

NestJS RBAC API with authentication, role and permission management, user role assignment, permission overrides, audit logging, PostgreSQL via TypeORM, and Redis-backed cache support.

## Tech Stack

- NestJS 11
- TypeScript
- TypeORM
- PostgreSQL
- Redis
- Swagger

## Requirements

- Node.js 22 or compatible
- npm
- PostgreSQL
- Redis

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=nestjs_rbac
DB_SYNCHRONIZE=false
DB_LOGGING=false

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_TTL=3600

JWT_SECRET=change-this-secret
```

Keep `DB_SYNCHRONIZE=false` when using migrations.

## Installation

```bash
npm install
```

## Database Setup

Create the PostgreSQL database first:

```bash
createdb nestjs_rbac
```

Run migrations:

```bash
npm run migration:run
```

Seed default RBAC roles and permissions:

```bash
npm run seed:rbac
```

The seed creates these roles:

- `admin`
- `manager`
- `operator`
- `viewer`

It also creates permissions such as `users.view`, `roles.manage`, `permissions.manage`, `loans.approve`, and `reports.view`.

## Running the App

Development mode:

```bash
npm run start:dev
```

Production build:

```bash
npm run build
npm run start:prod
```

By default the API runs on:

```text
http://localhost:3000
```

Swagger documentation is available at:

```text
http://localhost:3000/api/docs
```

## Authentication Flow

Register a user:

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "StrongPass123",
  "full_name": "Admin User"
}
```

Login:

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "StrongPass123"
}
```

Copy the returned `access_token` and use it as a bearer token:

```http
Authorization: Bearer <access_token>
```

Get the current user:

```http
GET /api/v1/auth/me
Authorization: Bearer <access_token>
```

## Main API Endpoints

### Roles

- `GET /api/v1/rbac/roles?page=1&limit=20`
- `POST /api/v1/rbac/roles`
- `GET /api/v1/rbac/roles/:id`
- `PUT /api/v1/rbac/roles/:id`
- `PATCH /api/v1/rbac/roles/:id`
- `DELETE /api/v1/rbac/roles/:id`
- `POST /api/v1/rbac/roles/:id/permissions`
- `DELETE /api/v1/rbac/roles/:id/permissions/:permission_id`

Create a role:

```json
{
  "name": "loan_admin",
  "display_name": "Loan Admin"
}
```

Assign permissions to a role:

```json
{
  "permission_ids": ["<permission_id>"]
}
```

### Permissions

- `GET /api/v1/rbac/permissions`
- `GET /api/v1/rbac/permissions?module=loans`
- `POST /api/v1/rbac/permissions`
- `PUT /api/v1/rbac/permissions/:id`
- `PATCH /api/v1/rbac/permissions/:id`
- `DELETE /api/v1/rbac/permissions/:id`

Create a permission:

```json
{
  "name": "loans.close",
  "display_name": "Close loans",
  "module": "loans"
}
```

### User Roles and Permissions

- `GET /api/v1/rbac/users/:user_id/roles`
- `POST /api/v1/rbac/users/:user_id/roles`
- `DELETE /api/v1/rbac/users/:user_id/roles/:role_id`
- `GET /api/v1/rbac/users/:user_id/permissions`
- `POST /api/v1/rbac/users/:user_id/permissions/override`

Assign roles to a user:

```json
{
  "role_ids": ["<role_id>"]
}
```

Grant or deny a permission override:

```json
{
  "permission_id": "<permission_id>",
  "is_denied": false
}
```

Set `is_denied` to `true` to explicitly deny the permission.

### Access Checks

Check one permission for the current JWT user:

```http
GET /api/v1/rbac/check-access?permission=loans.approve
Authorization: Bearer <access_token>
```

Check one permission for a specific user:

```http
GET /api/v1/rbac/check-access?permission=loans.approve&user_id=<user_id>
Authorization: Bearer <access_token>
```

Bulk check permissions:

```http
POST /api/v1/rbac/check-access/bulk
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "user_id": "<user_id>",
  "permissions": ["loans.approve", "loans.reject", "reports.export"]
}
```

Checking another user's access requires the current user to have `users.view_access`.

## Permissions Required for Management

- Create, update, delete roles: `roles.manage`
- Assign or remove role permissions: `roles.manage`
- Assign or remove user roles: `roles.manage`
- Create, update, delete permissions: `permissions.manage`
- Add permission overrides: `permissions.manage`
- View another user's effective permissions or access checks: `users.view_access`

## API Testing

Use the included `api-test.http` file with a REST client extension. Update these variables before running protected requests:

```http
@token = paste_access_token_here
@currentUserId = paste_current_user_id_here
@targetUserId = paste_target_user_id_here
@roleId = paste_role_id_here
@permissionId = paste_permission_id_here
```

## Useful Commands

```bash
npm run build
npm run start
npm run start:dev
npm run start:debug
npm run start:prod
npm run migration:generate -- src/database/migrations/NameOfMigration
npm run migration:run
npm run migration:revert
npm run seed:rbac
```

## Project Structure

```text
src/
  auth/          Authentication controllers, DTOs, and services
  config/        TypeORM and Redis configuration
  database/      Data source, migrations, seeds, and naming strategy
  rbac/          RBAC controllers, guards, decorators, DTOs, entities, services
  users/         User entity
```

## Notes for Contributors

- Use DTOs and validation decorators for request input.
- Protect management endpoints with `@RequirePermission(...)`.
- Run migrations instead of relying on schema synchronization.
- Keep permission names in the `module.action` format, for example `loans.approve`.
- Update `api-test.http` when adding or changing endpoints.
