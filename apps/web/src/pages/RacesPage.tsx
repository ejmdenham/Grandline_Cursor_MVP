import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchRaces,
  deleteRace,
  AdminRequiredError,
  type Race,
} from "@/services/api";

export default function RacesPage() {
  const { getIdToken } = useAuth();
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = await getIdToken();
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRaces(token);
      setRaces(data.races ?? []);
    } catch (e) {
      setError(e instanceof AdminRequiredError ? "Admin required" : (e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [getIdToken]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete race "${name}"?`)) return;
    const token = await getIdToken();
    if (!token) return;
    try {
      await deleteRace(id, token);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  if (loading) return <p>Loading races…</p>;
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Races</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <Link to="/races/new" style={{ display: "inline-block", marginBottom: "1rem" }}>
        New race
      </Link>
      <table style={{ borderCollapse: "collapse", width: "100%", maxWidth: "800px" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ccc" }}>
            <th style={{ textAlign: "left", padding: "0.5rem" }}>Name</th>
            <th style={{ textAlign: "left", padding: "0.5rem" }}>Invite code</th>
            <th style={{ textAlign: "left", padding: "0.5rem" }}>Start</th>
            <th style={{ textAlign: "left", padding: "0.5rem" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {races.map((r) => (
            <tr key={r.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem" }}>{r.name}</td>
              <td style={{ padding: "0.5rem" }}>{r.invite_code || "—"}</td>
              <td style={{ padding: "0.5rem" }}>{r.start_window || "—"}</td>
              <td style={{ padding: "0.5rem" }}>
                <Link to={`/races/${r.id}/edit`} style={{ marginRight: "0.5rem" }}>
                  Edit
                </Link>
                <button type="button" onClick={() => handleDelete(r.id, r.name)} style={{ color: "crimson" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {races.length === 0 && !loading && <p style={{ marginTop: "1rem" }}>No races.</p>}
    </div>
  );
}
