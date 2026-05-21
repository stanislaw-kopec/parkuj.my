import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as I from "../icons";
import { MOCK_PARKINGS } from "../data/mockData";
import { calcHours, getParkingStats } from "../data/parkingAvailability";

const makeIcon = () =>
  L.divIcon({
    className: "",
    html: `<div style="
      width:42px;height:42px;background:#F17300;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-weight:800;color:#fff;font-size:13px;font-family:Inter,sans-serif;
      box-shadow:0 0 20px rgba(241,115,0,0.5);
      border:3px solid rgba(255,255,255,0.8);
    ">P</div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -22],
  });

export default function ParkingDetailsPage({ parkingId, setPage }) {
  const parking = MOCK_PARKINGS.find((item) => item.id === parkingId) || MOCK_PARKINGS[0];
  const [date, setDate] = useState("2026-04-20");
  const [timeFrom, setTimeFrom] = useState("09:00");
  const [timeTo, setTimeTo] = useState("17:00");
  const hours = calcHours(timeFrom, timeTo);
  const stats = getParkingStats(parking, date, timeFrom, timeTo);
  const total = Math.round(hours * parking.price);

  return (
    <div className="fin parking-details">
      <div className="account-head">
        <button className="back-btn" onClick={() => setPage("reserve")}>
          ← Wróć do rezerwacji
        </button>
        <button className="btn btn-a" onClick={() => setPage("reserve")}>
          Rezerwuj miejsce <I.Arr />
        </button>
      </div>

      <section className="parking-hero">
        <div className="parking-hero-copy">
          <div className="pc-icon">{parking.img}</div>
          <h1>{parking.name}</h1>
          <p>{parking.address}</p>
          <div className="parking-hero-meta">
            <span><I.Star /> {parking.rating}</span>
            <span>{parking.price} zł/h</span>
            <span>{parking.spots} miejsc</span>
          </div>
        </div>
        <div className="parking-mini-map">
          <MapContainer center={parking.coords} zoom={14} style={{ height: "100%", width: "100%" }} zoomControl={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
              maxZoom={20}
            />
            <Marker position={parking.coords} icon={makeIcon()}>
              <Popup>{parking.name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </section>

      <section className="wt-card details-filter">
        <div className="fg">
          <label className="fl">Data</label>
          <input className="fi" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="fg">
          <label className="fl">Od</label>
          <input className="fi" type="time" value={timeFrom} onChange={(e) => setTimeFrom(e.target.value)} />
        </div>
        <div className="fg">
          <label className="fl">Do</label>
          <input className="fi" type="time" value={timeTo} onChange={(e) => setTimeTo(e.target.value)} />
        </div>
        <div className="filter-summary">
          <span>{hours > 0 ? `${hours} h · ${total} zł` : "Nieprawidłowe godziny"}</span>
          <strong>{stats.available} wolnych miejsc</strong>
        </div>
      </section>

      <section className="details-stats">
        <div className="d-stat">
          <div className="d-stat-l">Dostępne miejsca</div>
          <div className="d-stat-v">{stats.available}</div>
          <div className="d-stat-c">z {parking.spots} wszystkich</div>
        </div>
        <div className="d-stat">
          <div className="d-stat-l">Obłożenie</div>
          <div className="d-stat-v">{stats.occupancy}%</div>
          <div className="d-stat-c up">dla wybranego terminu</div>
        </div>
        <div className="d-stat">
          <div className="d-stat-l">Rezerwacje dziś</div>
          <div className="d-stat-v">{stats.reservationsToday}</div>
          <div className="d-stat-c">szczyt {stats.peak}</div>
        </div>
      </section>

      <section className="details-grid">
        <div className="wt-card">
          <h2>Podział miejsc</h2>
          <p className="desc">Miejsca online są dostępne do rezerwacji w aplikacji, a walk-in zostają dla kierowców z drogi.</p>
          <div className="parking-bars">
            <div>
              <div className="bar-label"><span>Rezerwacje online</span><strong>{stats.reservable}</strong></div>
              <div className="bar-track"><span style={{ width: `${(stats.reservable / parking.spots) * 100}%` }} /></div>
            </div>
            <div>
              <div className="bar-label"><span>Walk-in</span><strong>{stats.walkIn}</strong></div>
              <div className="bar-track muted"><span style={{ width: `${(stats.walkIn / parking.spots) * 100}%` }} /></div>
            </div>
          </div>
        </div>

        <div className="wt-card">
          <h2>Informacje</h2>
          <div className="parking-info-list">
            <div><span>Cena godzinowa</span><strong>{parking.price} zł</strong></div>
            <div><span>Szacowany koszt</span><strong>{total > 0 ? `${total} zł` : "—"}</strong></div>
            <div><span>Adres</span><strong>{parking.address}</strong></div>
            <div><span>Rozpoznawanie tablic</span><strong>Aktywne</strong></div>
          </div>
        </div>
      </section>
    </div>
  );
}
