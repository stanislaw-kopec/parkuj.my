import { useState } from "react";
import * as I from "../icons";
import PCard from "./PCard";
import { MOCK_PARKINGS } from "../data/mockData";

const STEPS = [
  { n: 1, label: "Parking" },
  { n: 2, label: "Szczegóły" },
  { n: 3, label: "Płatność" },
];

const calcHours = (from, to) => {
  const [fH, fM] = from.split(":").map(Number);
  const [tH, tM] = to.split(":").map(Number);
  const diff = tH * 60 + tM - (fH * 60 + fM);
  return Math.max(0, Math.round((diff / 60) * 10) / 10);
};

const fmtDate = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
};

export default function ReservePage({ setToast }) {
  const [step, setStep]           = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [plate, setPlate]         = useState("");
  const [date, setDate]           = useState("2026-04-20");
  const [timeFrom, setTimeFrom]   = useState("09:00");
  const [timeTo, setTimeTo]       = useState("17:00");
  const [payMethod, setPayMethod] = useState("blik");
  const [blik, setBlik]           = useState(["", "", "", "", "", ""]);

  const parking  = MOCK_PARKINGS.find((p) => p.id === selectedId);
  const hours    = calcHours(timeFrom, timeTo);
  const total    = Math.round(hours * (parking?.price || 0));
  const loyalty  = Math.round(total * 0.2);

  const handleBlikDigit = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...blik];
    next[i] = val;
    setBlik(next);
    if (val && i < 5) document.getElementById(`blik-${i + 1}`)?.focus();
  };

  const handleConfirm = () => {
    setStep(1);
    setSelectedId(null);
    setPlate("");
    setBlik(["", "", "", "", "", ""]);
    setToast("✓ Rezerwacja potwierdzona! Szlaban otworzy się automatycznie.");
  };

  const StepBar = ({ current }) => (
    <div className="wt-bar">
      {STEPS.map((s, i) => (
        <div key={s.n} className={`wt-s ${current > s.n ? "ok" : ""} ${current === s.n ? "on" : ""}`}>
          <div className="wt-d">{current > s.n ? <I.Check /> : s.n}</div>
          <div className="wt-l">{s.label}</div>
          {i < STEPS.length - 1 && <div className="wt-line" />}
        </div>
      ))}
    </div>
  );

  const Summary = () => (
    <div className="res-summary">
      <div className="card" style={{ padding: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Podsumowanie</div>
        <div style={{ fontSize: 13, color: "var(--text2)" }}>
          {[
            ["Parking",  parking?.name || "—"],
            ["Data",     fmtDate(date) || "—"],
            ["Godziny",  hours > 0 ? `${timeFrom} – ${timeTo}` : "—"],
            ["Czas",     hours > 0 ? `${hours} h` : "—"],
            ["Tablica",  plate || "—"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid var(--border)" }}>
              <span>{k}</span>
              <span style={{ color: "var(--text)", fontWeight: 500, fontFamily: k === "Tablica" ? "'Space Mono',monospace" : "inherit", fontSize: k === "Tablica" ? 12 : 13 }}>{v}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0", fontWeight: 800, fontSize: 16 }}>
            <span style={{ color: "var(--text)" }}>Suma</span>
            <span style={{ color: "var(--accent)", fontFamily: "'Space Mono',monospace" }}>
              {total > 0 ? `${total} zł` : "—"}
            </span>
          </div>
        </div>
      </div>
      {loyalty > 0 && (
        <div style={{ padding: "10px 14px", background: "var(--accent-bg)", border: "1px solid var(--accent-border)", borderRadius: 8, fontSize: 12, color: "var(--accent)", display: "flex", gap: 6, alignItems: "center" }}>
          <I.Heart /> +{loyalty} punktów lojalnościowych
        </div>
      )}
    </div>
  );

  /* ── Step 1: choose parking ── */
  if (step === 1) return (
    <div className="fin">
      <div className="sh">
        <div>
          <h2 className="st">Zarezerwuj miejsce</h2>
          <p className="ss">Krok 1 z 3 — wybierz parking</p>
        </div>
      </div>
      <StepBar current={1} />
      <div className="card-grid">
        {MOCK_PARKINGS.map((p) => (
          <PCard key={p.id} p={p} selected={selectedId === p.id} onClick={() => setSelectedId(p.id)} />
        ))}
      </div>
      <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
        <button className="btn btn-a" disabled={!selectedId} onClick={() => setStep(2)}>
          Dalej <I.Arr />
        </button>
      </div>
    </div>
  );

  /* ── Step 2: details + live summary ── */
  if (step === 2) return (
    <div className="fin">
      <button className="btn btn-o btn-sm" style={{ marginBottom: 16 }} onClick={() => setStep(1)}>
        ← Wróć
      </button>
      <StepBar current={2} />
      <div className="res-layout">
        <div className="wt-card">
          <h2>Szczegóły rezerwacji</h2>
          <p className="desc">{parking?.name} · {parking?.price} zł/h</p>

          <div className="fg">
            <label className="fl">Numer rejestracyjny</label>
            <input
              className="fi"
              placeholder="np. WA 12345"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              style={{ fontFamily: "'Space Mono',monospace", letterSpacing: 1 }}
            />
          </div>

          <div className="fg">
            <label className="fl">Data</label>
            <input className="fi" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="fr" style={{ marginBottom: 18 }}>
            <div>
              <label className="fl">Od</label>
              <input className="fi" type="time" value={timeFrom} onChange={(e) => setTimeFrom(e.target.value)} />
            </div>
            <div>
              <label className="fl">Do</label>
              <input className="fi" type="time" value={timeTo} onChange={(e) => setTimeTo(e.target.value)} />
            </div>
          </div>

          {hours > 0 && (
            <div style={{ padding: "10px 14px", background: "var(--bg3)", borderRadius: 8, fontSize: 13, marginBottom: 18, display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text2)" }}>{hours} h × {parking?.price} zł</span>
              <span style={{ fontWeight: 700, color: "var(--accent)", fontFamily: "'Space Mono',monospace" }}>{total} zł</span>
            </div>
          )}

          <div className="wt-acts">
            <div />
            <button
              className="btn btn-a"
              disabled={!plate || hours <= 0}
              onClick={() => setStep(3)}
            >
              Przejdź do płatności <I.Arr />
            </button>
          </div>
        </div>

        <Summary />
      </div>
    </div>
  );

  /* ── Step 3: payment ── */
  return (
    <div className="fin">
      <button className="btn btn-o btn-sm" style={{ marginBottom: 16 }} onClick={() => setStep(2)}>
        ← Wróć
      </button>
      <StepBar current={3} />
      <div className="res-layout">
        <div className="wt-card">
          <h2>Metoda płatności</h2>
          <p className="desc">Wybierz jak chcesz zapłacić</p>

          <div className="pay-methods">
            {[
              { id: "blik",  icon: "📱", label: "BLIK" },
              { id: "card",  icon: "💳", label: "Karta" },
              { id: "gpay",  icon: "G",  label: "Google Pay", isG: true },
            ].map((m) => (
              <div
                key={m.id}
                className={`pay-method ${payMethod === m.id ? "on" : ""}`}
                onClick={() => setPayMethod(m.id)}
              >
                <div className="pay-method-icon" style={m.isG ? { fontFamily: "sans-serif", fontWeight: 700, fontSize: 18, color: "#4285F4" } : {}}>
                  {m.icon}
                </div>
                <div className="pay-method-label">{m.label}</div>
              </div>
            ))}
          </div>

          {payMethod === "blik" && (
            <div>
              <label className="fl">Kod BLIK</label>
              <p style={{ fontSize: 12, color: "var(--text2)", marginBottom: 12 }}>
                Otwórz aplikację bankową i wygeneruj 6-cyfrowy kod.
              </p>
              <div className="blik-input">
                {blik.map((v, i) => (
                  <input
                    key={i}
                    id={`blik-${i}`}
                    className="blik-digit"
                    maxLength={1}
                    value={v}
                    onChange={(e) => handleBlikDigit(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !v && i > 0)
                        document.getElementById(`blik-${i - 1}`)?.focus();
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {payMethod === "card" && (
            <div>
              <div className="fg">
                <label className="fl">Numer karty</label>
                <input className="fi" placeholder="0000 0000 0000 0000" style={{ fontFamily: "'Space Mono',monospace", letterSpacing: 1 }} />
              </div>
              <div className="fg">
                <label className="fl">Imię i nazwisko</label>
                <input className="fi" placeholder="JAN KOWALSKI" style={{ fontFamily: "'Space Mono',monospace", textTransform: "uppercase", letterSpacing: 0.5 }} />
              </div>
              <div className="fr">
                <div className="fg">
                  <label className="fl">Ważna do</label>
                  <input className="fi" placeholder="MM/RR" style={{ fontFamily: "'Space Mono',monospace" }} />
                </div>
                <div className="fg">
                  <label className="fl">CVV</label>
                  <input className="fi" placeholder="•••" maxLength={3} style={{ fontFamily: "'Space Mono',monospace" }} />
                </div>
              </div>
            </div>
          )}

          {payMethod === "gpay" && (
            <div style={{ padding: "20px 0", textAlign: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", background: "#000", borderRadius: 10, cursor: "pointer", fontSize: 16, fontWeight: 600, color: "#fff" }}>
                <span style={{ color: "#4285F4", fontWeight: 800 }}>G</span>
                <span style={{ color: "#fff" }}>oogle</span>
                <span style={{ color: "#34A853", marginLeft: 2 }}>Pay</span>
              </div>
              <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 10 }}>
                Zostaniesz przekierowany do Google Pay
              </p>
            </div>
          )}

          <button
            className="btn btn-a btn-block"
            style={{ marginTop: 20 }}
            onClick={handleConfirm}
          >
            Zapłać {total} zł i zarezerwuj <I.Check />
          </button>
        </div>

        <Summary />
      </div>
    </div>
  );
}
