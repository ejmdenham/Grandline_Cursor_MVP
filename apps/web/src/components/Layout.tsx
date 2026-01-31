import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Layout() {
  const { signOut } = useAuth();
  const location = useLocation();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: "200px",
          background: "#1a1a1a",
          color: "#fff",
          padding: "1rem 0",
        }}
      >
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <Link
            to="/races"
            style={{
              padding: "0.5rem 1rem",
              color: location.pathname.startsWith("/races") ? "#4fc3f7" : "#ccc",
              textDecoration: "none",
            }}
          >
            Races
          </Link>
          <Link
            to="/users"
            style={{
              padding: "0.5rem 1rem",
              color: location.pathname.startsWith("/users") ? "#4fc3f7" : "#ccc",
              textDecoration: "none",
            }}
          >
            Users
          </Link>
          <button
            type="button"
            onClick={() => signOut()}
            style={{
              margin: "1rem 1rem 0",
              padding: "0.5rem 1rem",
              background: "transparent",
              border: "1px solid #666",
              color: "#ccc",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: "1.5rem", background: "#f5f5f5" }}>
        <Outlet />
      </main>
    </div>
  );
}
