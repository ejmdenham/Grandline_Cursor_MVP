# Grandline Admin Web

React + TypeScript + Vite admin app for user and race management. Uses the same Cognito user pool as the player app; only users in the `admin` group can access.

## Setup

1. Copy `.env.example` to `.env` and fill in values from Terraform outputs:
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
