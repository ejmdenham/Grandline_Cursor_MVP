import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { fetchAuthSession, getCurrentUser, signInWithRedirect, signOut as amplifySignOut } from "aws-amplify/auth";
import { env } from "@/config/env";

type AuthState = {
  loading: boolean;
  authenticated: boolean;
  isAdmin: boolean;
  error: string | null;
};

type AuthContextValue = AuthState & {
  signIn: () => void;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    loading: true,
    authenticated: false,
    isAdmin: false,
    error: null,
  });

  const checkAuth = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const user = await getCurrentUser();
      if (!user) {
        setState({ loading: false, authenticated: false, isAdmin: false, error: null });
        return;
      }
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      if (!idToken) {
        setState({ loading: false, authenticated: false, isAdmin: false, error: null });
        return;
      }
      const payload = parseJwt(idToken);
      const raw = payload["cognito:groups"];
      const groups = Array.isArray(raw) ? raw : typeof raw === "string" ? [raw] : [];
      const admin = groups.includes("admin");
      setState({
        loading: false,
        authenticated: true,
        isAdmin: admin,
        error: admin ? null : "Admin access required",
      });
    } catch {
      setState({ loading: false, authenticated: false, isAdmin: false, error: null });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const signIn = useCallback(async () => {
    if (!env.cognitoUserPoolId || !env.cognitoClientId) {
      setState((s) => ({
        ...s,
        loading: false,
        error:
          "Cognito is not configured. Add VITE_COGNITO_USER_POOL_ID and VITE_COGNITO_CLIENT_ID to .env (see .env.example).",
      }));
      return;
    }
    setState((s) => ({ ...s, error: null, loading: true }));
    try {
      await signInWithRedirect({});
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : "Sign-in failed",
      }));
    }
  }, []);

  const signOut = useCallback(async () => {
    await amplifySignOut();
    setState({ loading: false, authenticated: false, isAdmin: false, error: null });
  }, []);

  const getIdToken = useCallback(async (): Promise<string | null> => {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.idToken?.toString() ?? null;
    } catch {
      return null;
    }
  }, []);

  const value: AuthContextValue = {
    ...state,
    signIn,
    signOut,
    getIdToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

function parseJwt(token: string): Record<string, unknown> {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return {};
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return {};
  }
}
