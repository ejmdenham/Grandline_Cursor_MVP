import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AuthGate } from "@/components/AuthGate";
import Layout from "@/components/Layout";
import UsersPage from "@/pages/UsersPage";
import RacesPage from "@/pages/RacesPage";
import RaceEditPage from "@/pages/RaceEditPage";
import CallbackPage from "@/pages/CallbackPage";

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { loading, authenticated, isAdmin, error, signIn, signOut } = useAuth();
  if (loading) {
    return (
      <AuthGate title="Grandline" body="Loading…" />
    );
  }
  if (!authenticated) {
    return (
      <AuthGate
        title="Sign in"
        body="The admin tool is waiting."
        error={error}
        actionLabel={loading ? "Redirecting…" : "Sign in"}
        onAction={signIn}
        actionDisabled={loading}
      />
    );
  }
  if (!isAdmin || error) {
    return (
      <AuthGate
        title="Admin required"
        body="This tool is for operators in the admin group."
        error={error}
        secondaryLabel="Log out"
        onSecondary={() => {
          void signOut();
        }}
      />
    );
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/callback" element={<CallbackPage />} />
      <Route
        path="/"
        element={
          <RequireAdmin>
            <Layout />
          </RequireAdmin>
        }
      >
        <Route index element={<Navigate to="/races" replace />} />
        <Route path="races" element={<RacesPage />} />
        <Route path="races/new" element={<RaceEditPage />} />
        <Route path="races/:id/edit" element={<RaceEditPage />} />
        <Route path="users" element={<UsersPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
