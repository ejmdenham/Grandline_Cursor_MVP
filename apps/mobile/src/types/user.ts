/**
 * User/session types aligned with Cognito (sub, email, preferred_username).
 * Used by auth service and drawer placeholder.
 */

export interface User {
  id: string;
  email?: string;
  name?: string;
}

export interface Session {
  user: User;
  accessToken: string;
  idToken?: string;
  refreshToken?: string;
}
