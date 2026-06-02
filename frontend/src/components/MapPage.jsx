import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MOCK_PARKINGS } from "../data/mockData";

const makeIcon = (available) =>
  L.divIcon({
    className: "",
    html: `<div style="
      width:36px;height:36px;
      background:${available < 10 ? "#f87171" : "#F17300"};
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-weight:800;color:#fff;font-size:13px;
      font-family:Inter,sans-serif;
      box-shadow:0 0 20px ${available < 10 ? "rgba(248,113,113,0.5)" : "rgba(241,115,0,0.5)"};
      border:2.5px solid rgba(255,255,255,0.25);
    ">P</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -22],
  });

export default function MapPage({ setPage }) {
  const [active, setActive] = useState(null);

  return (
    <div className="fin">
      <div className="sh">
        <div>
          <h2 className="st">Mapa parkingów</h2>
          <p className="ss">Znajdź parking w okolicy Warszawy</p>
        </div>
      </div>

      <div className="map-wrapper">
        <div className="map-lft">
          <MapContainer
            center={[52.2297, 21.0122]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
              maxZoom={20}
            />
            {MOCK_PARKINGS.map((p) => (
              <Marker
                key={p.id}
                position={p.coords}
                icon={makeIcon(p.available)}
                eventHandlers={{ click: () => setActive(p.id) }}
              >
                <Popup>
                  <div style={{ fontFamily: "Inter,sans-serif", minWidth: 160 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>{p.address}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                      <span style={{ color: p.available < 10 ? "#ef4444" : "#22c55e", fontWeight: 600 }}>
                        {p.available} wolnych
                      </span>
                      <span style={{ color: "#F17300", fontWeight: 700 }}>{p.price} zł/h</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="map-side">
          <div style={{ fontWeight: 700, marginBottom: 14, fontSize: 14 }}>W okolicy</div>
          {MOCK_PARKINGS.map((p) => (
            <div
              key={p.id}
              onClick={() => setActive(active === p.id ? null : p.id)}
              style={{
                padding: "10px 8px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                borderRadius: active === p.id ? "var(--r)" : 0,
                background: active === p.id ? "var(--bg3)" : "transparent",
                transition: "background 0.15s",
              }}
            >
              <div className="pc-icon" style={{ width: 32, height: 32, fontSize: 16, flexShrink: 0 }}>
                {p.img}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {p.name}
                </div>
                <div style={{ fontSize: 11, color: p.available < 10 ? "var(--danger)" : "var(--success)", fontWeight: 500 }}>
                  {p.available} wolnych / {p.spots}
                </div>
              </div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, color: "var(--accent)", fontSize: 13, flexShrink: 0 }}>
                {p.price} zł
              </div>
            </div>
          ))}

          <button
            className="btn btn-a btn-block"
            style={{ marginTop: 16 }}
            onClick={() => setPage("reserve")}
          >
            Zarezerwuj miejsce
          </button>
        </div>
      </div>
    </div>
  );
}
