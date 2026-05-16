import { useState } from "react";
import Navigation from "../components/Navigation";
import { useWatches } from "../hooks/useWatches";
import { useAuth } from "../contexts/AuthContext";
import { Watch, X, Check } from "lucide-react";

interface Props {
  watchId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReserveModal({ watchId, onClose, onSuccess }: Props) {
  const { watches, createReservation } = useWatches();
  const { user } = useAuth();
  const watch = watches.find((w) => w.id === watchId);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!watch) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!startDate || !endDate || !user) return;

    // Max 14 days
    const diff = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24);
    if (diff > 14) { setError("Maximum rental period is 14 days."); return; }
    if (diff < 1) { setError("Minimum rental is 1 day."); return; }

    setLoading(true);
    setError("");
    try {
      createReservation({ watchId, borrowerId: user.id, startDate, endDate, notes });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Booking failed.");
    } finally { setLoading(false); }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in" onClick={onClose}>
      <div className="card-luxury w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--jet)]">
          <div>
            <h2 className="font-serif text-lg font-bold text-[var(--ivory)]">Reserve Watch</h2>
            <p className="text-[var(--muted-foreground)] text-xs mt-0.5">{watch.brand} {watch.name}</p>
          </div>
          <button onClick={onClose} className="text-[var(--muted-foreground)] hover:text-[var(--ivory)] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Watch preview */}
        <div className="flex items-center gap-3 px-5 py-3 bg-[var(--jet)] border-b border-[var(--border)]">
          <div className="w-12 h-12 rounded-lg bg-[var(--smoky)] flex items-center justify-center flex-shrink-0">
            {watch.imageUrl
              ? <img src={watch.imageUrl} alt={watch.name} className="w-full h-full object-contain p-1" />
              : <Watch className="w-5 h-5 text-[var(--gold)]" />
            }
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[var(--ivory)] truncate">{watch.name}</div>
            <div className="text-xs text-[var(--gold)]">${(watch.dailyRate / 100).toFixed(2)} / day</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">From</label>
              <input type="date" value={startDate} min={today} onChange={(e) => setStartDate(e.target.value)} className="input-luxury" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">To</label>
              <input type="date" value={endDate} min={startDate || today} onChange={(e) => setEndDate(e.target.value)} className="input-luxury" required />
            </div>
          </div>

          {startDate && endDate && (
            <div className="bg-[var(--jet)] rounded-lg px-3 py-2 text-center">
              <span className="text-[var(--muted-foreground)] text-xs">Duration: </span>
              <span className="text-[var(--gold)] text-sm font-semibold">
                {Math.max(0, Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000))} day(s)
              </span>
              <span className="text-[var(--muted-foreground)] text-xs mx-2"> · Total: </span>
              <span className="text-[var(--ivory)] text-sm font-semibold">
                ${((Math.max(1, Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000)) * watch.dailyRate) / 100).toFixed(2)}
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests or details..."
              rows={2}
              className="input-luxury resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-800 rounded-lg px-3 py-2 text-red-400 text-xs">
              {error}
            </div>
          )}

          <div className="bg-[var(--jet)] rounded-lg px-3 py-2 text-[var(--muted-foreground)] text-xs">
            <span className="text-[var(--gold)]">Max 14 days</span> per rental · $2/day flat rate
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full justify-center py-3 disabled:opacity-50"
          >
            {loading ? "Booking..." : <> <Check size={16} /> Confirm Reservation</>}
          </button>
        </form>
      </div>
    </div>
  );
}