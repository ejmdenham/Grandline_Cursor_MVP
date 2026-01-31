# Admin API

Base path: Admin HTTP API (separate from the player API). Base URL is the **admin API URL** (Terraform output `admin_api_url` from `infra/terraform_admin`).

All admin routes require:

1. A valid Cognito JWT in the `Authorization` header: `Bearer <id_token>`.
2. The token must be from a user in the **admin** Cognito group. Otherwise the API returns **403 Admin required**.

The admin app uses the **admin** Cognito app client (Hosted UI, OAuth code flow). The JWT audience is the admin client id.

---

## Admin Terraform variables

Admin Terraform (`infra/terraform_admin`) reads **player** Terraform outputs from the player state file via `terraform_remote_state`. Apply **player** Terraform first so `infra/terraform/terraform.tfstate` exists. Player outputs (cognito_user_pool_id, cognito_user_pool_arn, races_table_name, races_table_arn) are loaded automatically; you only set:

- `project_name` — resource naming (required)
- `stage` — deployment stage (default `dev`)
- `admin_callback_url` — OAuth callback URL for the admin web app (default `http://localhost:5173/callback`)
- `enable_admin_hosting` — S3 + CloudFront for the admin web app are **off by default** (run locally with `npm run dev`). Set to `true` to create them; see Phase 3.5 in [Grandline_Phases.md](../../Grandline_Phases.md).

State path: `../terraform/terraform.tfstate` (local backend). If player later uses an S3 backend, switch the `terraform_remote_state` config in [infra/terraform_admin/remote_state.tf](../../infra/terraform_admin/remote_state.tf).

See [infra/terraform_admin/terraform.tfvars.example](../../infra/terraform_admin/terraform.tfvars.example).

---

## Bootstrap admin user

To sign in to the admin app from day one, create a bootstrap admin user:

- **Email:** `grandline.mvp@gmail.com`
- **Password:** Set out-of-band only (e.g. Terraform sensitive variable `admin_bootstrap_password`, or AWS Console → Cognito → Users → Create user). **Do not store the password in the repo or in committed config.**

If using player Terraform: set `admin_bootstrap_password` (sensitive) to create this user in the `admin` group. After first apply, Terraform ignores password changes. See [README.md](../../README.md) and [infra/terraform/variables.tf](../../infra/terraform/variables.tf).

---

## Admin Races

Base path: `/admin/races`. Same race schema as the player API (see [data-model.md](../data-model.md) and [races.md](races.md)).

### GET /admin/races

List all races (Scan). **403** if not in admin group.

**Response:** `200` — `{ "races": [ ... ] }`

### GET /admin/races/{id}

Get a race by id. **403** if not admin; **404** if not found.

**Response:** `200` — race object.

### POST /admin/races

Create a race. Body: `{ "name", "checkpoints", "amot", "start_window", "invite_code", "paid", "organizer_id"? }`. Id and `created_at` are generated.

**Response:** `201` — created race object.

### PUT /admin/races/{id}

Update a race. Body: partial `{ "name", "checkpoints", "amot", "start_window", "invite_code", "paid", "organizer_id" }`.

**Response:** `200` — updated race object. **404** if not found.

### DELETE /admin/races/{id}

Delete a race. **Response:** `204`. **404** if not found.

---

## Admin Users

Base path: `/admin/users`. Cognito user pool operations.

### GET /admin/users

List users (Cognito ListUsers). Optional query: `limit` (default 60, max 60).

**Response:** `200` — `{ "users": [ { "username", "email?", "enabled?", "userStatus?", "created?" }, ... ] }`

### POST /admin/users

Create a user (AdminCreateUser). Body: `{ "username" (required), "temporaryPassword"? }`. Username is the email when the pool uses email as username.

**Response:** `201` — user summary. **409** if username exists.

### POST /admin/users/{username}/disable

Disable a user (AdminDisableUser).

**Response:** `200` — `{ "disabled": true, "username": "..." }`

### DELETE /admin/users/{username}

Delete a user (AdminDeleteUser). **Response:** `204`.

---

## CORS

Admin API allows `*` origins and common methods/headers for browser requests.
