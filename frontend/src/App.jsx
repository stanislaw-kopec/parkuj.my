import { useState, useEffect } from "react";
import Nav from "./components/Nav";
import Landing from "./components/Landing";
import AuthPage from "./components/AuthPage";
import HomePage from "./components/HomePage";
import ReservePage from "./components/ReservePage";
import Reservations from "./components/Reservations";
import JoinPage from "./components/JoinPage";
import Dashboard from "./components/Dashboard";
import ContactPage from "./components/ContactPage";
import { Check } from "./icons";

export default function App() {
  const [page, setPage]           = useState("landing");
  const [user, setUser]           = useState(null);
  const [role, setRole]           = useState("customer");
  const [showMenu, setShowMenu]   = useState(false);
  const [toast, setToast]         = useState(null);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => {
    const dismiss = () => setShowMenu(false);
    if (showMenu) document.addEventListener("click", dismiss);
    return () => document.removeEventListener("click", dismiss);
  }, [showMenu]);

  useEffect(() => {
    if (!user && page !== "landing" && page !== "join" && page !== "auth") setPage("landing");
  }, [user, page]);

  const renderPage = () => {
    switch (page) {
      case "landing":      return <Landing setPage={setPage} />;
      case "auth":         return <AuthPage setUser={setUser} setRole={setRole} setPage={setPage} setToast={setToast} />;
      case "home":         return <HomePage setPage={setPage} />;
      case "reserve":      return <ReservePage setToast={setToast} />;
      case "reservations": return <Reservations setPage={setPage} setToast={setToast} />;
      case "join":         return <JoinPage user={user} setUser={setUser} setPage={setPage} setRole={setRole} />;
      case "dashboard":    return <Dashboard setToast={setToast} />;
      case "contact":      return <ContactPage setToast={setToast} />;
      default:             return <Landing setPage={setPage} />;
    }
  };

  return (
    <div className="app">
      <Nav
        page={page}
        setPage={setPage}
        user={user}
        setUser={setUser}
        setRole={setRole}
        role={role}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
      />
      <main className="main">{renderPage()}</main>
      {toast && (
        <div className="toast">
          <Check /> {toast}
        </div>
      )}
    </div>
  );
}
