import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchRaces,
  deleteRace,
  AdminRequiredError,
  type Race,
} from "@/services/api";
import { formatCourse, formatWindow, raceStatus, statusLabel } from "@/theme/format";

export default function RacesPage() {
  const { getIdToken } = useAuth();
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = await getIdToken();
    if (!token) {
      setLoading(false);
      return;
    }
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

  return (
    <div>
      <div className="page-toolbar">
        <div className="page-toolbar__copy">
          <h1>Races</h1>
          <p>Create and time the course. Not the race itself.</p>
        </div>
        <Link to="/races/new" className="btn btn-ember">
          Create race
        </Link>
      </div>
      {error ? <p className="page-status is-error">{error}</p> : null}
      {loading ? <p className="page-status">Loading races…</p> : null}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Invite</th>
              <th>Window</th>
              <th>Course</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && races.length === 0 ? (
              <tr className="is-empty">
                <td className="cell-empty" colSpan={6}>
                  No races.
                </td>
              </tr>
            ) : (
              races.map((r) => {
                const status = raceStatus(r.start_window);
                return (
                  <tr key={r.id}>
                    <td className="cell-name">{r.name}</td>
                    <td className="cell-meta">{r.invite_code || "—"}</td>
                    <td className="cell-meta">{formatWindow(r.start_window)}</td>
                    <td className="cell-meta">{formatCourse(r.checkpoints?.length ?? 0)}</td>
                    <td>
                      <span className={`chip chip-${status}`}>{statusLabel[status]}</span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <Link to={`/races/${r.id}/edit`} className="btn-text ember">
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="btn-text flare"
                          onClick={() => handleDelete(r.id, r.name)}
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
