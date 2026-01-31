# Admin Users Lambda

Admin API for Cognito user management. Requires JWT with `cognito:groups` containing `admin`.

- **GET /admin/users** — list users (ListUsers)
- **POST /admin/users** — create user (AdminCreateUser; body: username, temporaryPassword?, messageAction?)
- **POST /admin/users/{username}/disable** — disable user
- **DELETE /admin/users/{username}** — delete user

Env: `COGNITO_USER_POOL_ID`.
