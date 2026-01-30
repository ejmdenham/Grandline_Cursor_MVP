# Auth — Cognito

Authentication for the Grandline player app is handled entirely by **Amazon Cognito**. There are no REST auth endpoints on the API.

## Flows

- **Sign up** — User registers via Cognito (Hosted UI or SDK).
- **Sign in** — User signs in via Cognito (Hosted UI or SDK).
- **Session / refresh** — Cognito issues ID and access tokens; refresh tokens are used to obtain new tokens.

The mobile app uses either:

- **Cognito Hosted UI** — User is redirected to Cognito’s web pages for sign up/sign in, then redirected back to the app (with a callback URL / app scheme).
- **Cognito SDK** — Direct calls from the app (e.g. Amplify Auth, or AWS SDK) using `USER_PASSWORD_AUTH` or `USER_SRP_AUTH`.

## Configuration (from Terraform)

After `terraform apply`, use these outputs in the mobile app (e.g. `.env`):

| Variable | Source | Description |
| -------- | ------ | ----------- |
| `EXPO_PUBLIC_COGNITO_USER_POOL_ID` | `terraform output cognito_user_pool_id` | User Pool id |
| `EXPO_PUBLIC_COGNITO_CLIENT_ID`   | `terraform output cognito_app_client_id` | App client id |
| `EXPO_PUBLIC_COGNITO_REGION`      | e.g. `eu-north-1` | AWS region of the User Pool |
| Hosted UI URL (optional)         | `terraform output cognito_hosted_ui_domain` + region | Base URL for Hosted UI |

Protected API routes (e.g. `/races`) require a valid Cognito JWT (ID or access token) in the `Authorization` header: `Bearer <token>`.
