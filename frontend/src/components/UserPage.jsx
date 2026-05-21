import * as I from "../icons";

const sortVehicles = (vehicles) =>
  [...vehicles].sort((a, b) => Number(b.primary) - Number(a.primary));

export default function UserPage({ user, vehicles, setVehicles, setPage, setToast }) {
  const makePrimary = (id) => {
    setVehicles(vehicles.map((vehicle) => ({ ...vehicle, primary: vehicle.id === id })));
    setToast("Zmieniono pojazd główny.");
  };

  const removeVehicle = (vehicle) => {
    if (vehicle.hasActiveReservation) {
      setToast("Nie można usunąć pojazdu z aktywną rezerwacją.");
      return;
    }

    const remaining = vehicles.filter((item) => item.id !== vehicle.id);
    const hasPrimary = remaining.some((item) => item.primary);
    setVehicles(
      hasPrimary || !remaining.length
        ? remaining
        : remaining.map((item, index) => ({ ...item, primary: index === 0 }))
    );
    setToast("Pojazd usunięty.");
  };

  return (
    <div className="fin account-page">
      <div className="account-head">
        <div>
          <h1>Moje konto</h1>
          <p>Dane kierowcy, pojazdy i szybkie akcje związane z rezerwacjami.</p>
        </div>
        <button className="btn btn-a" onClick={() => setPage("addCar")}>
          <I.Plus /> Dodaj pojazd
        </button>
      </div>

      <div className="profile-summary">
        <div className="profile-avatar">{user?.name?.[0] || "U"}</div>
        <div>
          <h2>{user?.name || "Użytkownik"}</h2>
          <p>{user?.email || "Brak adresu e-mail"}</p>
        </div>
        <button className="btn btn-o btn-sm" onClick={() => setPage("settings")}>
          <I.Gear /> Ustawienia
        </button>
      </div>

      <div className="account-grid">
        <section className="wt-card">
          <div className="section-row">
            <div>
              <h2>Pojazdy</h2>
              <p className="desc">Pojazd główny jest pokazywany na górze i wybierany domyślnie.</p>
            </div>
          </div>

          <div className="manage-vehicles">
            {sortVehicles(vehicles).map((vehicle) => (
              <div className="manage-vehicle" key={vehicle.id}>
                <div>
                  <strong>{vehicle.name}</strong>
                  <span className="vehicle-plate">{vehicle.country} · {vehicle.plate}</span>
                  {vehicle.hasActiveReservation && <small>Aktywna rezerwacja</small>}
                </div>
                <div className="vehicle-actions">
                  {vehicle.primary ? (
                    <span className="status-pill ok">Główny</span>
                  ) : (
                    <button className="btn btn-o btn-sm" onClick={() => makePrimary(vehicle.id)}>
                      Ustaw główny
                    </button>
                  )}
                  <button className="icon-btn danger" onClick={() => removeVehicle(vehicle)} title="Usuń pojazd">
                    <I.X />
                  </button>
                </div>
              </div>
            ))}

            {!vehicles.length && (
              <div className="empty-state">
                <I.Car />
                <span>Nie masz jeszcze zapisanego pojazdu.</span>
              </div>
            )}
          </div>
        </section>

        <aside className="wt-card account-side">
          <h2>Skróty</h2>
          <button className="quick-link" onClick={() => setPage("reserve")}>
            <I.Cal /> Nowa rezerwacja <I.Chev />
          </button>
          <button className="quick-link" onClick={() => setPage("reservations")}>
            <I.List /> Historia rezerwacji <I.Chev />
          </button>
          <button className="quick-link" onClick={() => setPage("contact")}>
            <I.Mail /> Kontakt z obsługą <I.Chev />
          </button>
        </aside>
      </div>
    </div>
  );
}
