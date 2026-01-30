import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as auth from '../services/auth';
import type { Session } from '../types/user';

interface AuthContextValue {
  session: Session | null;
  isLoading: boolean;
  setSession: (s: Session | null) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setSession = useCallback((s: Session | null) => {
    setSessionState(s);
  }, []);

  const signOut = useCallback(() => {
    auth.signOut();
    setSessionState(null);
  }, []);

  useEffect(() => {
    auth.getSession().then((s) => {
      setSessionState(s);
      setIsLoading(false);
    });
  }, []);

  const value: AuthContextValue = { session, isLoading, setSession, signOut };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
