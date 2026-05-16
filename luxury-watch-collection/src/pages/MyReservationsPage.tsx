import { useState } from "react";
import Navigation from "../components/Navigation";
import { useWatches } from "../hooks/useWatches";
import { useAuth } from "../contexts/AuthContext";
import { Calendar, Clock, AlertCircle, CheckCircle, XCircle, Watch } from "lucide-react";

const STATUS_CONFIG: Record<string, { icon: any; label: string; cls: string }> = {
  active:    { icon: <Clock size={14} />,       label: "Active",     cls: "badge-available" },
  completed: { icon: <CheckCircle size={14} />, label: "Returned",  cls: "bg-[var(--jet)] text-[var(--muted-foreground)]" },
  cancelled: { icon: <XCircle size={14} />,     label: "Cancelled", cls: "bg-[var(--jet)] text-red-400" },
};

export default function MyReservationsPage() {
  const { user } = useAuth();
  const { watches, reservations, cancelReservation, completeReservation } = useWatches();
  const my = reservations
    .filter((r) => r.borrowerId === user?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="min-h-screen bg-[var(--smoky)]">
      <Navigation />
      <div className="page-container fade-in">
        <h1 className="section-title mb-0.5">My Rentals</h1>
        <p className="muted-text text-sm mb-8">Your watch rental history</p>

        {my.length === 0 ? (
          <div className="card-luxury py-16 text-center">
            <Calendar size={40} className="mx-auto mb-3 text-[var(--muted-foreground)] opacity-30" />
            <p className="text-[var(--muted-foreground)]">No rentals yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {my.map((r) => {
              const watch = watches.find((w) => w.id === r.watchId);
              const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.completed;
              const days = Math.round((new Date(r.endDate).getTime() - new Date(r.startDate).getTime()) / 86400000) + 1;
              const total = watch ? (days * watch.dailyRate / 100).toFixed(2) : "—";

              return (
                <div key={r.id} className="card-luxury p-5 flex items-center gap-4">
                  {/* Watch thumb */}
                  <div className="w-16 h-16 rounded-xl bg-[var(--jet)] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {watch?.imageUrl
                      ? <img src={watch.imageUrl} alt={watch?.name} className="w-full h-full object-contain p-1" />
                      : <Watch className="w-6 h-6 text-[var(--gold)] opacity-50" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-serif font-bold text-[var(--ivory)] truncate">{watch?.name || "Unknown"}</span>
                      <span className={cfg.cls}>{cfg.icon} {cfg.label}</span>
                    </div>
                    <div className="text-[var(--muted-foreground)] text-xs">
                      {new Date(r.startDate).toLocaleDateString()} → {new Date(r.endDate).toLocaleDateString()}
                      <span className="mx-2">·</span>
                      {days} day{days !== 1 ? "s" : ""}
                      <span className="mx-2">·</span>
                      <span className="text-[var(--gold)]">${total}</span>
                    </div>
                    {r.notes && <p className="text-[var(--muted-foreground)] text-xs mt-1 italic">"{r.notes}"</p>}
                  </div>
                  {r.status === "active" && (
                    <div className="flex flex-col gap-2 shrink-0">
                      <button onClick={() => completeReservation(r.id)}
                        className="text-xs bg-[var(--gold)] text-[var(--smoky)] font-semibold px-3 py-1.5 rounded-lg hover:bg-[var(--gold-deep)] transition-colors">
                        Mark Returned
                      </button>
                      <button onClick={() => cancelReservation(r.id)}
                        className="text-xs border border-red-800 text-red-400 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-900/30 transition-colors">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
