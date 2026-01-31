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
      if (!token) return;
      try {
        const r = await fetchRace(id!, token);
        setRace(r);
      } catch (e) {
        setError(e instanceof NotFoundError ? "Race not found" : e instanceof AdminRequiredError ? "Admin required" : (e as Error).message);
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
      if (!token) return;
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

  if (loading && !isNew) return <p>Loading…</p>;
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{isNew ? "New race" : "Edit race"}</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "480px" }}>
        <label>
          Name
          <input
            type="text"
            value={race.name}
            onChange={(e) => setField("name", e.target.value)}
            required
            style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
          />
        </label>
        <label>
          Invite code
          <input
            type="text"
            value={race.invite_code}
            onChange={(e) => setField("invite_code", e.target.value)}
            style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
          />
        </label>
        <label>
          Start window (e.g. ISO8601)
          <input
            type="text"
            value={race.start_window}
            onChange={(e) => setField("start_window", e.target.value)}
            style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
          />
        </label>
        <label>
          AMOT (comma-separated, e.g. run,bike)
          <input
            type="text"
            value={Array.isArray(race.amot) ? race.amot.join(",") : ""}
            onChange={(e) => setField("amot", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
          />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input type="checkbox" checked={race.paid} onChange={(e) => setField("paid", e.target.checked)} />
          Paid
        </label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="submit" disabled={saving}>
            {saving ? "Saving…" : isNew ? "Create" : "Save"}
          </button>
          <Link to="/races">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
