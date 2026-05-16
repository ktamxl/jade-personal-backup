import { useState } from "react";
import "./index.css";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CatalogPage from "./pages/CatalogPage";
import MyReservationsPage from "./pages/MyReservationsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ManageWatchesPage from "./pages/ManageWatchesPage";
import ReserveModal from "./pages/ReserveModal";

type Route = "home" | "catalog" | "my-reservations" | "admin" | "manage";

function AppRouter() {
  const { user } = useAuth();
  const [route, setRoute] = useState<Route>("home");
  const [reserveWatchId, setReserveWatchId] = useState<string | null>(null);

  if (!user) return <LoginPage />;

  function NavBtn({ r, label }: { r: Route; label: string }) {
    return (
      <button onClick={() => setRoute(r)}
        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${route === r ? "bg-[var(--gold)] text-[var(--smoky)]" : "text-[var(--muted-foreground)] hover:text-[var(--ivory)]"}`}>
        {label}
      </button>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-50 bg-[var(--onyx)] border-b border-[var(--jet)] backdrop-blur-md">
        <div className="page-container flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--gold)] flex items-center justify-center text-[var(--smoky)] font-bold text-sm">P</div>
            <span className="font-serif font-bold text-[var(--ivory)] text-lg">Prestige Collection</span>
          </div>
          <div className="flex items-center gap-1">
            <NavBtn r="home" label="Home" />
            <NavBtn r="catalog" label="Catalog" />
            <NavBtn r="my-reservations" label="My Rentals" />
            {user.role === "owner" && <NavBtn r="admin" label="Dashboard" />}
            {user.role === "owner" && <NavBtn r="manage" label="Manage" />}
          </div>
          <div className="text-xs text-[var(--muted-foreground)] hidden md:block">
            {user.name} · <span className="text-[var(--gold)] capitalize">{user.role}</span>
          </div>
        </div>
      </div>

      <main>
        {route === "home" && <HomePage onNavigate={(r) => setRoute(r as Route)} />}
        {route === "catalog" && <CatalogPage onSelectWatch={(id) => setReserveWatchId(id)} />}
        {route === "my-reservations" && <MyReservationsPage />}
        {route === "admin" && <AdminDashboardPage />}
        {route === "manage" && <ManageWatchesPage />}
      </main>

      {reserveWatchId && (
        <ReserveModal watchId={reserveWatchId} onClose={() => setReserveWatchId(null)} onSuccess={() => setReserveWatchId(null)} />
      )}
    </>
  );
}

export default function App() {
  return <AuthProvider><AppRouter /></AuthProvider>;
}
