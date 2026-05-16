import { useState } from "react";
import * as I from "../icons";
import { MOCK_RESERVATIONS } from "../data/mockData";

const fmtDate = (iso) => {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
};

export default function Reservations({ setPage, setToast }) {
  const [list, setList]       = useState(MOCK_RESERVATIONS);
  const [expanded, setExpanded] = useState(null);

  const cancel = (e, id) => {
    e.stopPropagation();
    setList((prev) => prev.filter((r) => r.id !== id));
    setToast("Rezerwacja anulowana.");
  };

  if (list.length === 0) return (
    <div className="fin">
      <div className="sh">
        <div>
          <h2 className="st">Moje rezerwacje</h2>
          <p className="ss">Historia i aktywne</p>
        </div>
      </div>
      <div className="card">
        <div className="empty">
          <div className="empty-ic"><I.List /></div>
          <h3>Brak rezerwacji</h3>
          <p>Nie masz jeszcze żadnych rezerwacji. Zarezerwuj pierwsze miejsce!</p>
          <button className="btn btn-a" onClick={() => setPage("reserve")}>
            <I.Cal /> Zarezerwuj teraz
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fin">
      <div className="sh">
        <div>
          <h2 className="st">Moje rezerwacje</h2>
          <p className="ss">{list.filter((r) => r.status === "active").length} aktywnych · {list.filter((r) => r.status === "completed").length} zakończonych</p>
        </div>
        <button className="btn btn-a btn-sm" onClick={() => setPage("reserve")}>
          <I.Plus /> Nowa
        </button>
      </div>

      {list.map((r) => (
        <div key={r.id}>
          <div
            className={`ri ${expanded === r.id ? "expanded" : ""}`}
            onClick={() => setExpanded(expanded === r.id ? null : r.id)}
          >
            <div className={`r-dot ${r.status}`} />
            <div className="r-info">
              <div className="r-name">{r.parking}</div>
              <div className="r-det">
                <span>{fmtDate(r.date)}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <I.Clock /> {r.time}
                </span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, background: "var(--bg3)", padding: "1px 8px", borderRadius: 6 }}>
                  {r.plate}
                </span>
              </div>
            </div>
            <span className={`spill ${r.status}`}>
              {r.status === "active" ? "Aktywna" : "Zakończona"}
            </span>
            <div className="r-price">{r.price} zł</div>
            {r.status === "active" && (
              <button
                className="btn btn-danger btn-sm"
                onClick={(e) => cancel(e, r.id)}
                style={{ marginLeft: 4 }}
              >
                <I.X /> Anuluj
              </button>
            )}
            {r.status === "completed" && (
              <button
                className="btn btn-o btn-sm"
                onClick={(e) => e.stopPropagation()}
                title="Pobierz paragon"
              >
                <I.Download />
              </button>
            )}
          </div>

          {expanded === r.id && (
            <div className="r-expand">
              <div className="r-expand-item">
                <strong>{r.address}</strong>
                Adres parkingu
              </div>
              <div className="r-expand-item">
                <strong>Miejsce {r.spot}</strong>
                Numer miejsca
              </div>
              <div className="r-expand-item">
                <strong style={{ fontFamily: "'Space Mono',monospace" }}>{r.id}</strong>
                ID rezerwacji
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
