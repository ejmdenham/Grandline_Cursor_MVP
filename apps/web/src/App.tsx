import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import UsersPage from "@/pages/UsersPage";
import RacesPage from "@/pages/RacesPage";
import RaceEditPage from "@/pages/RaceEditPage";
import CallbackPage from "@/pages/CallbackPage";

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { loading, authenticated, isAdmin, error, signIn } = useAuth();
  if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>Loading…</div>;
  if (!authenticated) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Sign in to access the admin app.</p>
        <button type="button" onClick={signIn}>
          Sign in
        </button>
      </div>
    );
  }
  if (!isAdmin || error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Admin access required.</p>
        <p>{error}</p>
      </div>
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
