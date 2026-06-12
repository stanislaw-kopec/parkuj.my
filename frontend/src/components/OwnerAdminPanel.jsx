import { useEffect, useState } from "react";
import * as I from "../icons";
import { fetchMyParkingLots, fetchLotReservations } from "../data/api";

const STATUS_LABELS = {
  active: { label: "Aktywna", color: "var(--success)" },
  completed: { label: "Zakończona", color: "var(--text3)" },
  cancelled: { label: "Anulowana", color: "var(--danger)" },
};

const FILTER_OPTIONS = [
  { value: "all",       label: "Wszystkie" },
  { value: "active",    label: "Aktywne" },
  { value: "completed", label: "Zakończone" },
  { value: "cancelled", label: "Anulowane" },
];

export default function OwnerAdminPanel({ user, setToast }) {
  const [lots, setLots]           = useState([]);
  const [lotId, setLotId]         = useState(null);
  const [reservations, setRes]    = useState([]);
  const [loading, setLoading]     = useState(true);
  const [resLoading, setResLoading] = useState(false);
  const [filter, setFilter]       = useState("all");
  const [plateFil, setPlateFil]   = useState("");

  useEffect(() => {
    if (!user?.customerId) { setLoading(false); return; }
    let active = true;
    (async () => {
      try {
        const data = await fetchMyParkingLots(user.customerId);
        if (!active) return;
        setLots(data || []);
        const firstId = data?.[0]?.id ?? data?.[0]?.parkingLotId ?? null;
        setLotId(firstId);
      } catch {
        if (active) setLots([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [user?.customerId]);

  useEffect(() => {
    if (!lotId || !user?.customerId) return;
    let active = true;
    setResLoading(true);
    fetchLotReservations(lotId, user.customerId)
      .then((data) => { if (active) setRes(data); })
      .catch(() => { if (active) setRes([]); })
      .finally(() => { if (active) setResLoading(false); });
    return () => { active = false; };
  }, [lotId, user?.customerId]);

  const refresh = () => {
    if (!lotId || !user?.customerId) return;
    setResLoading(true);
    fetchLotReservations(lotId, user.customerId)
      .then(setRes)
      .catch(() => setRes([]))
      .finally(() => setResLoading(false));
  };

  const visible = reservations.filter((r) => {
    if (filter !== "all" && r.status !== filter) return false;
    if (plateFil && !r.plate.toLowerCase().includes(plateFil.toLowerCase())) return false;
    return true;
  });

  if (loading) return (
    <div className="fin">
      <div className="sh"><div><h2 className="st">Panel administracyjny</h2><p className="ss">Wczytywanie…</p></div></div>
    </div>
  );

  if (!lots.length) return (
    <div className="fin">
      <div className="sh"><div><h2 className="st">Panel administracyjny</h2></div></div>
      <div className="empty" style={{ padding: "60px 24px" }}>
        <div className="empty-ic"><I.Dash /></div>
        <h3>Brak zarejestrowanych parkingów</h3>
        <p>Dodaj parking przez kreator, aby zobaczyć tu rezerwacje klientów.</p>
      </div>
    </div>
  );

  return (
    <div className="fin">
      <div className="sh">
        <div>
          <h2 className="st">Panel administracyjny</h2>
          {lots.length > 1 ? (
            <select
              className="fs"
              style={{ marginTop: 4, fontSize: 13 }}
              value={lotId || ""}
              onChange={(e) => setLotId(Number(e.target.value))}
            >
              {lots.map((l) => (
                <option key={l.id ?? l.parkingLotId} value={l.id ?? l.parkingLotId}>
                  {l.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="ss">{lots[0]?.name}</p>
          )}
        </div>
        <button className="btn btn-o btn-sm" onClick={refresh} disabled={resLoading}>
          {resLoading ? "Odświeżanie…" : "Odśwież"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`btn btn-sm ${filter === opt.value ? "btn-a" : "btn-o"}`}
              onClick={() => setFilter(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <input
          className="fi"
          style={{ flex: 1, minWidth: 160, maxWidth: 240 }}
          placeholder="Filtruj po tablicy…"
          value={plateFil}
          onChange={(e) => setPlateFil(e.target.value)}
        />
      </div>

      {resLoading ? (
        <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text3)" }}>Wczytywanie rezerwacji…</div>
      ) : visible.length === 0 ? (
        <div className="empty" style={{ padding: "48px 0" }}>
          <div className="empty-ic"><I.List /></div>
          <p style={{ color: "var(--text3)", marginTop: 12 }}>Brak rezerwacji spełniających kryteria.</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ color: "var(--text3)", borderBottom: "1px solid var(--border)" }}>
                <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Kod</th>
                <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Tablica</th>
                <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Data</th>
                <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Godziny</th>
                <th style={{ textAlign: "right", padding: "8px 12px", fontWeight: 600 }}>Kwota</th>
                <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => {
                const s = STATUS_LABELS[r.status] || { label: r.status, color: "var(--text3)" };
                return (
                  <tr
                    key={r.id}
                    style={{ borderBottom: "1px solid var(--border)", transition: "background 0.1s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(129,164,205,0.06)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = ""}
                  >
                    <td style={{ padding: "10px 12px", fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: 1 }}>
                      {r.code || "—"}
                    </td>
                    <td style={{ padding: "10px 12px", fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>
                      {r.plate}
                    </td>
                    <td style={{ padding: "10px 12px" }}>{r.date || "—"}</td>
                    <td style={{ padding: "10px 12px", color: "var(--text3)" }}>{r.time || "—"}</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600 }}>
                      {r.price} zł
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ color: s.color, fontWeight: 600, fontSize: 12 }}>{s.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ padding: "8px 12px", fontSize: 12, color: "var(--text3)" }}>
            {visible.length} z {reservations.length} rezerwacji
          </div>
        </div>
      )}
    </div>
  );
}
