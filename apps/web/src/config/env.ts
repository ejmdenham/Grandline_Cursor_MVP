export const env = {
  adminApiUrl: import.meta.env.VITE_ADMIN_API_URL ?? "",
  cognitoUserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID ?? "",
  cognitoClientId: import.meta.env.VITE_COGNITO_CLIENT_ID ?? "",
  cognitoRegion: import.meta.env.VITE_COGNITO_REGION ?? "eu-north-1",
  cognitoHostedUiPrefix: import.meta.env.VITE_COGNITO_HOSTED_UI_PREFIX ?? "",
};
