import Navigation from "../components/Navigation";
import { useWatches } from "../hooks/useWatches";
import { useAuth } from "../contexts/AuthContext";
import { Watch, Calendar, DollarSign, Clock, TrendingUp } from "lucide-react";

export default function AdminDashboardPage() {
  const { user, isOwner } = useAuth();
  const { watches, reservations } = useWatches();

  const active = reservations.filter((r) => r.status === "active");
  const completed = reservations.filter((r) => r.status === "completed");
  const totalRevenue = completed.reduce((sum, r) => {
    const w = watches.find((w) => w.id === r.watchId);
    if (!w) return sum;
    const days = Math.round((new Date(r.endDate).getTime() - new Date(r.startDate).getTime()) / 86400000) + 1;
    return sum + days * w.dailyRate;
  }, 0);

  const stats = [
    { label: "Total Watches", value: watches.length, icon: <Watch size={20} />, color: "var(--gold)" },
    { label: "Currently Out", value: active.length, icon: <Clock size={20} />, color: "#f59e0b" },
    { label: "Completed Rentals", value: completed.length, icon: <Calendar size={20} />, color: "#22c55e" },
    { label: "Total Revenue", value: `$${(totalRevenue / 100).toFixed(2)}`, icon: <DollarSign size={20} />, color: "#a78bfa" },
  ];

  return (
    <div className="min-h-screen bg-[var(--smoky)]">
      <Navigation />
      <div className="page-container fade-in">
        <div className="mb-8">
          <h1 className="section-title">Dashboard</h1>
          <p className="muted-text text-sm mt-1">Welcome back, {user?.name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="card-luxury p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[var(--muted-foreground)] text-xs uppercase tracking-wider">{s.label}</span>
                <div style={{ color: s.color }}>{s.icon}</div>
              </div>
              <div className="text-3xl font-bold text-[var(--ivory)]">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Active Rentals */}
        <div className="mb-8">
          <h2 className="font-serif text-xl font-bold text-[var(--ivory)] mb-4">Active Rentals</h2>
          {active.length === 0 ? (
            <div className="card-luxury py-8 text-center text-[var(--muted-foreground)] text-sm">No active rentals</div>
          ) : (
            <div className="space-y-3">
              {active.map((r) => {
                const w = watches.find((ww) => ww.id === r.watchId);
                const days = Math.round((new Date(r.endDate).getTime() - new Date(r.startDate).getTime()) / 86400000) + 1;
                return (
                  <div key={r.id} className="card-luxury p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--jet)] flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {w?.imageUrl
                        ? <img src={w.imageUrl} alt={w?.name} className="w-full h-full object-contain p-1" />
                        : <Watch size={18} className="text-[var(--gold)]" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[var(--ivory)] text-sm">{w?.name || "Unknown Watch"}</div>
                      <div className="text-[var(--muted-foreground)] text-xs mt-0.5">
                        {new Date(r.startDate).toLocaleDateString()} → {new Date(r.endDate).toLocaleDateString()}
                        <span className="mx-2">·</span>
                        {days} day{days !== 1 ? "s" : ""}
                      </div>
                    </div>
                    <div className="badge-available">Active</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent History */}
        <div>
          <h2 className="font-serif text-xl font-bold text-[var(--ivory)] mb-4">Rental History</h2>
          <div className="card-luxury overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--jet)] text-left">
                  {["Watch", "Dates", "Days", "Revenue", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-[var(--muted-foreground)] text-xs uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...completed, ...reservations.filter((r) => r.status === "cancelled")]
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 10).map((r) => {
                  const w = watches.find((ww) => ww.id === r.watchId);
                  const days = Math.round((new Date(r.endDate).getTime() - new Date(r.startDate).getTime()) / 86400000) + 1;
                  const rev = w ? (days * w.dailyRate / 100).toFixed(2) : "—";
                  return (
                    <tr key={r.id} className="border-b border-[var(--jet)]/50 hover:bg-[var(--jet)]/30 transition-colors">
                      <td className="px-4 py-3 text-[var(--ivory)] font-medium">{w?.name || "—"}</td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)] text-xs">
                        {new Date(r.startDate).toLocaleDateString()} → {new Date(r.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">{days}</td>
                      <td className="px-4 py-3 text-[var(--gold)] font-semibold">${rev}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold ${
                          r.status === "completed" ? "text-green-400" : r.status === "active" ? "text-amber-400" : "text-red-400"
                        }`}>{r.status.toUpperCase()}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
