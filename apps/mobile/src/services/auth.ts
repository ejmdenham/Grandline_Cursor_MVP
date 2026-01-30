/**
 * Auth service — Cognito sign in, sign up, session.
 * Uses amazon-cognito-identity-js; config from env (User Pool id, Client id).
 */

import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import { env } from '../config/env';
import type { User, Session } from '../types/user';

const pool = new CognitoUserPool({
  UserPoolId: env.cognito.userPoolId,
  ClientId: env.cognito.clientId,
});

function userFromCognitoUser(cognitoUser: CognitoUser, payload?: { sub?: string; email?: string; 'cognito:username'?: string; preferred_username?: string }): User {
  const sub = payload?.sub ?? '';
  const email = payload?.email ?? payload?.['cognito:username'] ?? undefined;
  const name = payload?.preferred_username ?? payload?.['cognito:username'] ?? undefined;
  return { id: sub, email, name };
}

/**
 * Get the current Cognito user (if any). Does not validate session.
 */
export function getCurrentUser(): CognitoUser | null {
  return pool.getCurrentUser();
}

/**
 * Get current session (tokens + user). Returns null if not signed in or session invalid.
 */
export function getSession(): Promise<Session | null> {
  return new Promise((resolve) => {
    const cognitoUser = pool.getCurrentUser();
    if (!cognitoUser) {
      resolve(null);
      return;
    }
    cognitoUser.getSession((err: Error | null, session: { isValid: () => boolean; getAccessToken: () => { getJwtToken: () => string }; getIdToken: () => { getJwtToken: () => string }; getRefreshToken?: () => { getToken: () => string } } | null) => {
      if (err || !session || !session.isValid()) {
        resolve(null);
        return;
      }
      const idToken = session.getIdToken().getJwtToken();
      const payload = parseJwtPayload(idToken);
      resolve({
        user: userFromCognitoUser(cognitoUser, payload),
        accessToken: session.getAccessToken().getJwtToken(),
        idToken,
        refreshToken: session.getRefreshToken?.()?.getToken?.(),
      });
    });
  });
}

function parseJwtPayload(token: string): Record<string, string> {
  try {
    const base64 = token.split('.')[1];
    if (!base64) return {};
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as Record<string, string>;
  } catch {
    return {};
  }
}

/**
 * Sign in with email and password. Uses USER_PASSWORD_AUTH (simpler; ensure app client allows it in Cognito).
 */
export function signIn(email: string, password: string): Promise<Session> {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: pool,
    });
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session) => {
        const idToken = session.getIdToken().getJwtToken();
        const payload = parseJwtPayload(idToken);
        resolve({
          user: userFromCognitoUser(cognitoUser, payload),
          accessToken: session.getAccessToken().getJwtToken(),
          idToken,
          refreshToken: session.getRefreshToken?.()?.getToken?.(),
        });
      },
      onFailure: (err) => reject(err),
    });
  });
}

/**
 * Sign out (global sign-out for current user).
 */
export function signOut(): void {
  const cognitoUser = pool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.globalSignOut({
      onSuccess: () => {},
      onFailure: () => {},
    });
  }
}

/**
 * Sign up with email and password. Optional name stored as preferred_username.
 * Confirmation (e.g. email verify) is handled by Cognito/Phase 1 config.
 */
export function signUp(email: string, password: string, name?: string): Promise<{ userSub: string }> {
  const attributes: CognitoUserAttribute[] = [];
  if (name) {
    attributes.push(new CognitoUserAttribute({ Name: 'preferred_username', Value: name }));
  }
  attributes.push(new CognitoUserAttribute({ Name: 'email', Value: email }));

  return new Promise((resolve, reject) => {
    pool.signUp(email, password, attributes, [], (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ userSub: result?.user.getUsername() ?? result?.userSub ?? '' });
    });
  });
}
