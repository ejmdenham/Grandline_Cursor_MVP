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
    if (!token) return;
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

  if (loading) return <p>Loading users…</p>;
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Users</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <button type="button" onClick={() => setShowAdd(!showAdd)}>
        {showAdd ? "Cancel" : "Add user"}
      </button>
      {showAdd && (
        <form onSubmit={handleAdd} style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "320px" }}>
          <input
            type="email"
            placeholder="Email (username)"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Temporary password (optional)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="submit">Create user</button>
        </form>
      )}
      <table style={{ marginTop: "1.5rem", borderCollapse: "collapse", width: "100%", maxWidth: "600px" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ccc" }}>
            <th style={{ textAlign: "left", padding: "0.5rem" }}>Email / Username</th>
            <th style={{ textAlign: "left", padding: "0.5rem" }}>Status</th>
            <th style={{ textAlign: "left", padding: "0.5rem" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.username} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem" }}>{u.email ?? u.username}</td>
              <td style={{ padding: "0.5rem" }}>{u.enabled === false ? "Disabled" : u.userStatus ?? "—"}</td>
              <td style={{ padding: "0.5rem" }}>
                {u.enabled !== false && (
                  <button type="button" onClick={() => handleDisable(u.username)} style={{ marginRight: "0.5rem" }}>
                    Disable
                  </button>
                )}
                <button type="button" onClick={() => handleDelete(u.username)} style={{ color: "crimson" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && !loading && <p style={{ marginTop: "1rem" }}>No users.</p>}
    </div>
  );
}
