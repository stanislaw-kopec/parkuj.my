import { useState } from "react";
import * as I from "../icons";

const COUNTRIES = [
  { code: "PL", label: "Polska" },
  { code: "DE", label: "Niemcy" },
  { code: "CZ", label: "Czechy" },
  { code: "SK", label: "Słowacja" },
  { code: "UA", label: "Ukraina" },
];

const normalizePlate = (plate) => plate.trim().replace(/\s+/g, " ").toUpperCase();

export default function AddCarPage({ vehicles, setVehicles, setPage, setToast }) {
  const [form, setForm] = useState({
    name: "",
    plate: "",
    country: "PL",
    primary: vehicles.length === 0,
  });
  const [error, setError] = useState("");

  const update = (key) => (event) => {
    setError("");
    const value = key === "primary" ? event.target.checked : event.target.value;
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const plate = normalizePlate(form.plate);
    const name = form.name.trim() || "Mój pojazd";

    if (!plate) {
      setError("Podaj numer rejestracyjny pojazdu.");
      return;
    }

    const alreadyExists = vehicles.some(
      (vehicle) => vehicle.plate === plate && vehicle.country === form.country
    );

    if (alreadyExists) {
      setError("Pojazd z taką tablicą i krajem jest już zapisany.");
      return;
    }

    const nextVehicle = {
      id: Date.now(),
      name,
      plate,
      country: form.country,
      primary: form.primary || vehicles.length === 0,
      hasActiveReservation: false,
    };

    setVehicles(
      nextVehicle.primary
        ? vehicles.map((vehicle) => ({ ...vehicle, primary: false })).concat(nextVehicle)
        : vehicles.concat(nextVehicle)
    );
    setToast("Pojazd dodany do konta.");
    setPage("user");
  };

  return (
    <div className="fin account-page">
      <div className="account-head">
        <button className="back-btn" onClick={() => setPage("user")}>
          ← Wróć
        </button>
        <div>
          <h1>Dodaj pojazd</h1>
          <p>Tablica i kraj muszą tworzyć unikalną parę na koncie.</p>
        </div>
      </div>

      <div className="account-grid">
        <form className="wt-card account-form" onSubmit={handleSubmit}>
          <h2>Dane pojazdu</h2>
          <p className="desc">Zapisany pojazd będzie dostępny podczas rezerwacji.</p>

          {error && <div className="auth-error"><I.Alert /> {error}</div>}

          <div className="fg">
            <label className="fl">Nazwa pojazdu</label>
            <input className="fi" value={form.name} onChange={update("name")} placeholder="np. Toyota Corolla" />
          </div>

          <div className="fr">
            <div className="fg">
              <label className="fl">Numer rejestracyjny</label>
              <input
                className="fi plate-input"
                value={form.plate}
                onChange={(event) => setForm({ ...form, plate: event.target.value.toUpperCase() })}
                placeholder="WA 12345"
              />
            </div>
            <div className="fg">
              <label className="fl">Kod kraju</label>
              <select className="fs" value={form.country} onChange={update("country")}>
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.code} - {country.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="auth-check">
            <input type="checkbox" checked={form.primary} onChange={update("primary")} />
            <span>Ustaw jako pojazd główny</span>
          </label>

          <div className="wt-acts">
            <button type="button" className="btn btn-o" onClick={() => setPage("user")}>Anuluj</button>
            <button type="submit" className="btn btn-a">Dodaj pojazd <I.Check /></button>
          </div>
        </form>

        <div className="account-side wt-card">
          <div className="account-icon"><I.Car /></div>
          <h2>Wymagania</h2>
          <ul className="account-list">
            <li>Numer rejestracyjny i kod kraju są sprawdzane razem.</li>
            <li>Jeden pojazd może być oznaczony jako główny.</li>
            <li>Pojazd główny pojawia się na górze listy.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
