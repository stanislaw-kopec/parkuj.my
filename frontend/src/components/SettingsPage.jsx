import { useEffect, useState } from "react";
import * as I from "../icons";
import { fetchCurrentCustomer, updateCurrentCustomer } from "../data/api";

export default function SettingsPage({ user, setUser, setToast }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: user?.phone || "",
    emailNotifications: true,
    smsNotifications: false,
    reservationReminders: true,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Załaduj świeże dane z bazy przy wejściu na stronę.
  useEffect(() => {
    if (!user?.customerId) return;
    let active = true;
    fetchCurrentCustomer(user.customerId).then((c) => {
      if (!active) return;
      setForm((prev) => ({
        ...prev,
        firstName: c.firstName || "",
        lastName: c.lastName || "",
        email: c.email || "",
        phone: c.phone || "",
      }));
    }).catch(() => { /* zostaw obecny stan */ });
    return () => { active = false; };
  }, [user?.customerId]);

  const update = (key) => (event) => {
    setError("");
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm({ ...form, [key]: value });
  };

  const saveSettings = async (event) => {
    event.preventDefault();
    if (!user?.customerId) {
      setError("Brak danych zalogowanego użytkownika.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const updated = await updateCurrentCustomer(user.customerId, {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
      });
      const refreshed = {
        ...user,
        name: `${updated.firstName} ${updated.lastName}`.trim(),
        email: updated.email,
        phone: updated.phone,
      };
      localStorage.setItem("user", JSON.stringify(refreshed));
      setUser(refreshed);
      setToast("Ustawienia zapisane.");
    } catch (err) {
      setError(err.message || "Nie udało się zapisać ustawień.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fin account-page">
      <div className="account-head">
        <div>
          <h1>Ustawienia</h1>
          <p>Zarządzaj danymi konta, powiadomieniami i preferencjami rezerwacji.</p>
        </div>
      </div>

      <form className="settings-grid" onSubmit={saveSettings}>
        <section className="wt-card account-form">
          <h2>Dane konta</h2>
          <p className="desc">Te dane są używane do potwierdzeń rezerwacji i kontaktu z obsługą.</p>

          {error && (
            <div className="auth-error" style={{ marginBottom: 16 }}>
              <I.Alert /> {error}
            </div>
          )}

          <div className="fr">
            <div className="fg">
              <label className="fl">Imię</label>
              <input className="fi" value={form.firstName} onChange={update("firstName")} />
            </div>
            <div className="fg">
              <label className="fl">Nazwisko</label>
              <input className="fi" value={form.lastName} onChange={update("lastName")} />
            </div>
          </div>
          <div className="fg">
            <label className="fl">Adres e-mail</label>
            <input className="fi" type="email" value={form.email} onChange={update("email")} />
          </div>
          <div className="fg">
            <label className="fl">Telefon</label>
            <input className="fi" value={form.phone} onChange={update("phone")} placeholder="+48 500 000 000" />
          </div>
        </section>

        <section className="wt-card account-form">
          <h2>Powiadomienia</h2>
          <p className="desc">Wybierz, jak chcesz otrzymywać informacje o rezerwacjach.</p>

          <label className="setting-toggle">
            <span>
              <strong>E-mail</strong>
              <small>Potwierdzenia, faktury i zmiany statusu.</small>
            </span>
            <input type="checkbox" checked={form.emailNotifications} onChange={update("emailNotifications")} />
          </label>
          <label className="setting-toggle">
            <span>
              <strong>SMS</strong>
              <small>Kod rezerwacji i pilne komunikaty.</small>
            </span>
            <input type="checkbox" checked={form.smsNotifications} onChange={update("smsNotifications")} />
          </label>
          <label className="setting-toggle">
            <span>
              <strong>Przypomnienia</strong>
              <small>Powiadomienie przed rozpoczęciem postoju.</small>
            </span>
            <input type="checkbox" checked={form.reservationReminders} onChange={update("reservationReminders")} />
          </label>
        </section>

        <section className="wt-card account-form">
          <h2>Bezpieczeństwo</h2>
          <p className="desc">Projekt docelowo korzysta z Google OAuth i tokenów JWT.</p>
          <button className="btn btn-o btn-block" type="button">
            <I.Google /> Połącz konto Google
          </button>
          <button className="btn btn-o btn-block" type="button">
            <I.Shield /> Zmień hasło
          </button>
        </section>

        <section className="wt-card account-form">
          <h2>Płatności</h2>
          <p className="desc">Domyślna metoda płatności dla nowych rezerwacji.</p>
          <select className="fs" defaultValue="blik">
            <option value="blik">BLIK</option>
            <option value="card">Karta płatnicza</option>
            <option value="bank_transfer">Przelew</option>
          </select>
        </section>

        <div className="settings-actions">
          <button className="btn btn-a" type="submit" disabled={submitting}>
            {submitting ? "Zapisywanie…" : <>Zapisz ustawienia <I.Check /></>}
          </button>
        </div>
      </form>
    </div>
  );
}
