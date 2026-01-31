/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_API_URL: string;
  readonly VITE_COGNITO_USER_POOL_ID: string;
  readonly VITE_COGNITO_CLIENT_ID: string;
  readonly VITE_COGNITO_REGION: string;
  readonly VITE_COGNITO_HOSTED_UI_PREFIX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
