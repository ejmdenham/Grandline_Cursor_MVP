import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchRace,
  createRace,
  updateRace,
  AdminRequiredError,
  NotFoundError,
  type Race,
} from "@/services/api";

const emptyRace = (): Omit<Race, "id" | "created_at"> => ({
  name: "",
  checkpoints: [],
  amot: [],
  start_window: "",
  invite_code: "",
  paid: false,
});

export default function RaceEditPage() {
  const { id } = useParams<"id">();
  const navigate = useNavigate();
  const { getIdToken } = useAuth();
  const isNew = id === "new" || !id;
  const [race, setRace] = useState<Omit<Race, "id" | "created_at"> | Race>(emptyRace());
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) return;
    const load = async () => {
      const token = await getIdToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const r = await fetchRace(id!, token);
        setRace(r);
      } catch (e) {
        setError(
          e instanceof NotFoundError
            ? "Race not found"
            : e instanceof AdminRequiredError
              ? "Admin required"
              : (e as Error).message
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isNew, id, getIdToken]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const token = await getIdToken();
      if (!token) {
        setError("No token—sign in required");
        return;
      }
      setSaving(true);
      setError(null);
      try {
        const payload = {
          name: race.name,
          checkpoints: race.checkpoints,
          amot: race.amot,
          start_window: race.start_window,
          invite_code: race.invite_code,
          paid: race.paid,
          organizer_id: "organizer_id" in race ? race.organizer_id : undefined,
        };
        if (isNew) {
          const created = await createRace(payload, token);
          navigate(`/races/${created.id}/edit`, { replace: true });
        } else {
          await updateRace((race as Race).id, payload, token);
          setRace((prev) => ({ ...prev, ...payload }));
        }
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setSaving(false);
      }
    },
    [race, isNew, getIdToken, navigate]
  );

  const setField = (key: keyof Race, value: unknown) => {
    setRace((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className="page-toolbar">
        <div className="page-toolbar__copy">
          <h1>{isNew ? "New race" : "Edit race"}</h1>
          <p>{isNew ? "Name the course and set the window." : "Keep the course timed and precise."}</p>
        </div>
      </div>
      {error ? <p className="page-status is-error">{error}</p> : null}
      {loading && !isNew ? (
        <p className="page-status">Loading…</p>
      ) : (
        <form className="admin-form" onSubmit={handleSubmit}>
          <label className="field">
            Name
            <input
              type="text"
              value={race.name}
              onChange={(e) => setField("name", e.target.value)}
              required
            />
          </label>
          <label className="field">
            Invite code
            <input
              type="text"
              value={race.invite_code}
              onChange={(e) => setField("invite_code", e.target.value)}
            />
          </label>
          <label className="field">
            Start window (e.g. ISO8601)
            <input
              type="text"
              value={race.start_window}
              onChange={(e) => setField("start_window", e.target.value)}
            />
          </label>
          <label className="field">
            AMOT (comma-separated, e.g. run,bike)
            <input
              type="text"
              value={Array.isArray(race.amot) ? race.amot.join(",") : ""}
              onChange={(e) =>
                setField(
                  "amot",
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
            />
          </label>
          <label className="field-check">
            <input
              type="checkbox"
              checked={race.paid}
              onChange={(e) => setField("paid", e.target.checked)}
            />
            Paid
          </label>
          <div className="form-actions">
            <button type="submit" className="btn btn-ember" disabled={saving}>
              {saving ? "Saving…" : isNew ? "Create race" : "Save"}
            </button>
            <Link to="/races" className="btn-text stone">
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
