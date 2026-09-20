import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchUsers,
  createUser,
  disableUser,
  deleteUser,
  AdminRequiredError,
  type UserSummary,
} from "@/services/api";

export default function UsersPage() {
  const { getIdToken } = useAuth();
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const load = useCallback(async () => {
    const token = await getIdToken();
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers(token);
      setUsers(data.users ?? []);
    } catch (e) {
      setError(e instanceof AdminRequiredError ? "Admin required" : (e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [getIdToken]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await getIdToken();
    if (!token || !newEmail.trim()) return;
    setError(null);
    try {
      await createUser(newEmail.trim(), token, newPassword || undefined);
      setNewEmail("");
      setNewPassword("");
      setShowAdd(false);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleDisable = async (username: string) => {
    if (!confirm(`Disable user ${username}?`)) return;
    const token = await getIdToken();
    if (!token) return;
    try {
      await disableUser(username, token);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleDelete = async (username: string) => {
    if (!confirm(`Delete user ${username}? This cannot be undone.`)) return;
    const token = await getIdToken();
    if (!token) return;
    try {
      await deleteUser(username, token);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div>
      <div className="page-toolbar">
        <div className="page-toolbar__copy">
          <h1>Users</h1>
          <p>Cognito accounts for the course. Not the race itself.</p>
        </div>
        <button
          type="button"
          className={showAdd ? "btn btn-ghost" : "btn btn-ember"}
          onClick={() => setShowAdd(!showAdd)}
        >
          {showAdd ? "Cancel" : "Add user"}
        </button>
      </div>
      {error ? <p className="page-status is-error">{error}</p> : null}
      {showAdd && (
        <form className="admin-form inline" onSubmit={handleAdd}>
          <label className="field">
            Email (username)
            <input
              type="email"
              placeholder="you@course"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </label>
          <label className="field">
            Temporary password (optional)
            <input
              type="password"
              placeholder="Leave blank to auto-generate"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>
          <div className="form-actions">
            <button type="submit" className="btn btn-ember">
              Create user
            </button>
          </div>
        </form>
      )}
      {loading ? <p className="page-status">Loading users…</p> : null}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email / Username</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && users.length === 0 ? (
              <tr className="is-empty">
                <td className="cell-empty" colSpan={3}>
                  No users.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const disabled = u.enabled === false;
                const status = disabled ? "Disabled" : u.userStatus ?? "—";
                return (
                  <tr key={u.username}>
                    <td className="cell-name">{u.email ?? u.username}</td>
                    <td>
                      <span className={`chip ${disabled ? "chip-disabled" : "chip-waiting"}`}>
                        {status}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        {u.enabled !== false && (
                          <button
                            type="button"
                            className="btn-text stone"
                            onClick={() => handleDisable(u.username)}
                          >
                            Disable
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn-text flare"
                          onClick={() => handleDelete(u.username)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
