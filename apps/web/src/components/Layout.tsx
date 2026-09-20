import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { BrandMark } from "@/components/BrandMark";

export default function Layout() {
  const { signOut } = useAuth();
  const location = useLocation();
  const racesActive = location.pathname.startsWith("/races");
  const usersActive = location.pathname.startsWith("/users");

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <BrandMark />
        <nav className="admin-sidebar__nav" aria-label="Admin">
          <Link to="/races" className={`nav-link${racesActive ? " is-active" : ""}`}>
            Races
          </Link>
          <Link to="/users" className={`nav-link${usersActive ? " is-active" : ""}`}>
            Users
          </Link>
        </nav>
        <div className="admin-sidebar__foot">
          <button type="button" className="btn-text flare" onClick={() => signOut()}>
            Log out
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-column">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
