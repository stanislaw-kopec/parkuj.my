import { useEffect, useMemo, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import * as I from "../icons";
import { fetchParkingLots, fetchParkingLotStats, updateParkingLotConfig } from "../data/api";

// Mock danych dot. wjazdów/wyjazdów — zostaje jako wizualizacja (US-K07/K09
// wymaga OCR i tabeli parking_session, out of scope na zaliczenie).
const ENTRIES = [
  { plate: "WA 12345", time: "14:32", type: "in",  status: "Rezerwacja OK" },
  { plate: "WE 99887", time: "14:18", type: "in",  status: "Rezerwacja OK" },
  { plate: "WB 55443", time: "14:05", type: "out", status: "Wyjazd — 4h 12min" },
  { plate: "WI 77221", time: "13:42", type: "in",  status: "Ręczne wpuszczenie" },
  { plate: "WA 33210", time: "13:15", type: "out", status: "Wyjazd — 2h 05min" },
];

const QUICK_ACTIONS = [
  { label: "Zmień cenę",         icon: <I.TrendUp /> },
  { label: "Godziny otwarcia",   icon: <I.Clock /> },
  { label: "Raport PDF",         icon: <I.Download /> },
];

const DAY_LABELS = ["Nd", "Pon", "Wt", "Śr", "Czw", "Pt", "Sob"];

export default function Dashboard({ setToast }) {
  const [lotId, setLotId]                 = useState(null);
  const [stats, setStats]                 = useState(null);
  const [loading, setLoading]             = useState(true);
  const [savingSplit, setSavingSplit]     = useState(false);
  const [splitError, setSplitError]       = useState("");
  const [barrierOpen, setBarrierOpen]     = useState(false);
  const [split, setSplit]                 = useState({ total: 0, reservable: 0 });

  // Pierwszy parking z aktywnych — w demo "panel operatora" pokazuje go domyślnie.
  // Docelowo właściciel byłby przypisany do konkretnego parkingu (user ↔ parking_lot).
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const lots = await fetchParkingLots();
        if (!active || !lots?.length) { setLoading(false); return; }
        const firstId = lots[0].id;
        setLotId(firstId);
        const s = await fetchParkingLotStats(firstId);
        if (!active) return;
        setStats(s);
        setSplit({ total: s.placesCount || 0, reservable: s.reservablePlacesCount || 0 });
      } catch {
        if (active) setStats(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const refreshStats = async () => {
    if (!lotId) return;
    try {
      const s = await fetchParkingLotStats(lotId);
      setStats(s);
      setSplit({ total: s.placesCount || 0, reservable: s.reservablePlacesCount || 0 });
    } catch { /* zostaw */ }
  };

  const handleSaveSplit = async () => {
    if (!lotId) return;
    if (split.reservable > split.total) {
      setSplitError("Liczba miejsc rezerwowanych nie może przekraczać liczby miejsc ogółem.");
      return;
    }
    setSplitError("");
    setSavingSplit(true);
    try {
      await updateParkingLotConfig(lotId, {
        placesCount: split.total,
        reservablePlacesCount: split.reservable,
      });
      await refreshStats();
      setToast("Podział miejsc zaktualizowany w bazie.");
    } catch (err) {
      setSplitError(err.message || "Nie udało się zapisać podziału.");
    } finally {
      setSavingSplit(false);
    }
  };

  const toggleBarrier = () => {
    setBarrierOpen((prev) => {
      setToast(prev ? "Szlaban zamknięty (mock)" : "Szlaban otwarty (mock)");
      return !prev;
    });
  };

  const setReservable = (value) => {
    const reservable = Math.min(Math.max(0, Number(value) || 0), split.total);
    setSplit({ ...split, reservable });
  };

  const walkIn = Math.max(0, split.total - split.reservable);
  const revenueChartData = useMemo(() => {
    if (!stats?.revenueLast7Days) return [];
    return stats.revenueLast7Days.map((p) => {
      const d = new Date(p.day);
      return { day: DAY_LABELS[d.getDay()], value: Number(p.value) || 0 };
    });
  }, [stats]);
  const totalWeekRevenue = revenueChartData.reduce((sum, p) => sum + p.value, 0);
  const occupancy = stats && stats.placesCount > 0
    ? Math.round((stats.activeReservationsCount / stats.placesCount) * 100)
    : 0;

  if (loading) return (
    <div className="fin">
      <div className="sh"><div><h2 className="st">Panel zarządzania</h2><p className="ss">Wczytywanie danych…</p></div></div>
    </div>
  );

  if (!stats) return (
    <div className="fin">
      <div className="sh"><div><h2 className="st">Panel zarządzania</h2><p className="ss">Brak danych parkingu w bazie.</p></div></div>
    </div>
  );

  return (
    <div className="fin">
      <div className="sh">
        <div>
          <h2 className="st">Panel zarządzania</h2>
          <p className="ss">{stats.parkingLotName} · z bazy danych</p>
        </div>
        <button className="btn btn-o btn-sm" onClick={refreshStats}>
          Odśwież
        </button>
      </div>

      <div className="d-grid">
        <div className="d-stat">
          <div className="d-stat-l">Obłożenie (aktywne)</div>
          <div className="d-stat-v">{occupancy}%</div>
          <div className="d-stat-c">{stats.activeReservationsCount} z {stats.placesCount} miejsc</div>
        </div>
        <div className="d-stat">
          <div className="d-stat-l">Przychód — bieżący miesiąc</div>
          <div className="d-stat-v">{Number(stats.revenueThisMonth || 0).toLocaleString("pl")} zł</div>
          <div className="d-stat-c">{stats.reservationsThisMonth} rezerwacji</div>
        </div>
        <div className="d-stat">
          <div className="d-stat-l">Aktywne rezerwacje</div>
          <div className="d-stat-v">{stats.activeReservationsCount}</div>
          <div className="d-stat-c">PENDING + CONFIRMED + ACTIVE</div>
        </div>
      </div>

      <div className="dash-layout">
        <div>
          <div className="d-sec">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <h3 style={{ margin: 0 }}>Przychód — ostatnie 7 dni</h3>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>
                Σ {totalWeekRevenue.toLocaleString("pl")} zł
              </span>
            </div>
            <div className="chart-c">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#F17300" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#F17300" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(129,164,205,0.12)" />
                  <XAxis dataKey="day" tick={{ fill: "#81A4CD", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#81A4CD", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#054A91", border: "1px solid rgba(129,164,205,0.22)", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: "#DBE4EE", fontWeight: 600 }}
                    itemStyle={{ color: "#F17300" }}
                    formatter={(v) => [`${v} zł`, "Przychód"]}
                  />
                  <Area type="monotone" dataKey="value" stroke="#F17300" strokeWidth={2} fill="url(#rev)" dot={{ fill: "#F17300", r: 3 }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="d-sec">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ margin: 0 }}>Ostatnie wjazdy / wyjazdy</h3>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>Demo — wymaga OCR</span>
            </div>
            <table className="dtbl">
              <thead>
                <tr><th>Tablica</th><th>Czas</th><th>Typ</th><th>Status</th></tr>
              </thead>
              <tbody>
                {ENTRIES.map((e, i) => (
                  <tr key={i}>
                    <td style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>{e.plate}</td>
                    <td>{e.time}</td>
                    <td>
                      <span style={{
                        padding: "2px 10px", borderRadius: 10, fontSize: 11, fontWeight: 600,
                        background: e.type === "in" ? "var(--success-bg)" : "var(--bg3)",
                        color: e.type === "in" ? "var(--success)" : "var(--text3)",
                      }}>
                        {e.type === "in" ? "Wjazd" : "Wyjazd"}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--text2)" }}>{e.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-sec">
            <h3>Sterowanie szlabanem</h3>
            <div className="bar-ctrl">
              <button className={`bar-sw ${barrierOpen ? "on" : ""}`} onClick={toggleBarrier} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>
                  Szlaban: <span style={{ color: barrierOpen ? "var(--success)" : "var(--danger)" }}>
                    {barrierOpen ? "OTWARTY" : "ZAMKNIĘTY"}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>Demo — wymaga sprzętu</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="d-sec">
            <h3>Podział miejsc</h3>
            <p className="desc">Zmiana zapisuje się natychmiast w bazie (PATCH /api/parking-lots/{lotId}/config).</p>
            <div className="split-summary compact">
              <div>
                <span>{split.total}</span>
                <small>razem</small>
              </div>
              <div>
                <span>{split.reservable}</span>
                <small>aplikacja</small>
              </div>
              <div>
                <span>{walkIn}</span>
                <small>walk-in</small>
              </div>
            </div>
            <div className="fg" style={{ marginTop: 18 }}>
              <label className="fl">Miejsca rezerwowane online</label>
              <input
                className="split-range"
                type="range"
                min="0"
                max={split.total}
                value={split.reservable}
                onChange={(e) => setReservable(e.target.value)}
              />
            </div>
            <div className="fr">
              <div className="fg">
                <label className="fl">Razem</label>
                <input
                  className="fi"
                  type="number"
                  min="0"
                  value={split.total}
                  onChange={(e) => setSplit({ total: Math.max(0, Number(e.target.value) || 0), reservable: split.reservable })}
                />
              </div>
              <div className="fg">
                <label className="fl">Online</label>
                <input
                  className="fi"
                  type="number"
                  min="0"
                  max={split.total}
                  value={split.reservable}
                  onChange={(e) => setReservable(e.target.value)}
                />
              </div>
            </div>
            {splitError && (
              <div className="auth-error" style={{ margin: "12px 0" }}>
                <I.Alert /> {splitError}
              </div>
            )}
            <button className="btn btn-a btn-block" onClick={handleSaveSplit} disabled={savingSplit}>
              {savingSplit ? "Zapisywanie…" : "Zapisz podział"}
            </button>
          </div>

          <div className="d-sec">
            <h3>Szybkie akcje</h3>
            {QUICK_ACTIONS.map((a, i) => (
              <button
                key={i}
                className="qa-item"
                onClick={() => setToast(`${a.label}…`)}
              >
                <div className="qa-item-ic">{a.icon}</div>
                <span style={{ flex: 1 }}>{a.label}</span>
                <I.Chev />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
