# Grandline Admin Web

React + TypeScript + Vite admin app for user and race management. Uses the same Cognito user pool as the player app; only users in the `admin` group can access.

## Setup

1. **Env:** Run `./scripts/gen-env-admin-web.sh` from repo root (requires player and admin Terraform applied). This writes `apps/web/.env` with the **admin** Cognito client ID — the admin API rejects tokens from other clients (e.g. mobile/player). If you see 401 Unauthorized when calling the API, regenerate env, restart the dev server, and sign out + sign in again.
   - **Player Terraform** (from `infra/terraform`): `cognito_user_pool_id`, `cognito_hosted_ui_domain`
   - **Admin Terraform** (from `infra/terraform_admin`): `admin_api_url`, `admin_cognito_client_id`
   - Set `VITE_COGNITO_HOSTED_UI_PREFIX` to the player output `cognito_hosted_ui_domain` (prefix only).

2. Install and run:
   ```bash
   npm install
   npm run dev
   ```
   App runs at http://localhost:5173. Sign in with a user in the `admin` group (e.g. bootstrap admin).

3. Build for deploy to S3/CloudFront:
   ```bash
   npm run build
   ```
   Upload the contents of `dist/` to the admin S3 bucket and invalidate the CloudFront distribution.

## Auth

- **Sign in**: Hosted UI (OAuth code flow). Redirects to Cognito and back to `/callback`.
- **Admin check**: JWT claim `cognito:groups` must include `admin`; otherwise the app shows "Admin required".
- **API**: All admin API requests send the Cognito ID token as `Authorization: Bearer <token>`.

## Pages

- **Races**: List, create, edit, delete races.
- **Users**: List, add, disable, delete Cognito users.

## Troubleshooting

- **403 "Admin required"** — The API received a valid JWT but the user is not in the `admin` Cognito group, or the token is from the wrong client. Fix: (1) Ensure `.env` was generated with `./scripts/gen-env-admin-web.sh` (so `VITE_COGNITO_CLIENT_ID` is the **admin** client ID, not the player one). (2) Ensure the signed-in user is in the Cognito `admin` group (e.g. bootstrap user from player Terraform `admin_bootstrap_password`). (3) Sign out and sign in again after changing env. Check CloudWatch logs for the admin-users/admin-races Lambda to see JWT claim keys when 403 is returned.
- **500 on race create** — The admin-races Lambda returns the actual error in the response body (`message` / `name`). Redeploy admin Lambdas (`cd infra/terraform_admin && terraform apply`), then try again; the UI or debug logs will show the backend error (e.g. DynamoDB permissions or table name).
