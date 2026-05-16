import { useState } from "react";
import Navigation from "../components/Navigation";
import { useWatches } from "../hooks/useWatches";
import { useAuth } from "../contexts/AuthContext";
import { Watch, Star, Calendar, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";

function WatchCard({ watch, onSelect }: { watch: any; onSelect: () => void }) {
  const [showBack, setShowBack] = useState(false);
  const img = showBack && watch.backImageUrl ? watch.backImageUrl : watch.imageUrl;

  return (
    <div className="card-luxury group hover:border-[var(--gold)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40">
      {/* Image */}
      <div className="relative bg-[var(--jet)] aspect-square flex items-center justify-center overflow-hidden rounded-t-xl">
        {img ? (
          <>
            <img src={img} alt={watch.name} className="w-full h-full object-contain p-2" />
            {watch.backImageUrl && (
              <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {[[false, "Front"], [true, "Back"]].map(([back, label]) => (
                  <button
                    key={String(back)}
                    onClick={(e) => { e.stopPropagation(); setShowBack(back as boolean); }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      showBack === back
                        ? "bg-[var(--gold)] text-[var(--smoky)]"
                        : "bg-black/70 text-white border border-white/20"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 text-[var(--muted-foreground)]">
            <Watch className="w-14 h-14 opacity-30" />
            <span className="text-xs">No image</span>
            <span className="text-xs text-[10px] opacity-60">Add iCloud/Google Photos URL</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-serif text-lg font-bold text-[var(--ivory)] leading-tight">{watch.name}</h3>
          {watch.available
            ? <span className="badge-available shrink-0">Available</span>
            : <span className="badge-rented shrink-0">Rented</span>
          }
        </div>
        <p className="text-[var(--muted-foreground)] text-sm mb-2">{watch.brand} · {watch.model}</p>
        <p className="text-[var(--muted-foreground)] text-xs mb-3 line-clamp-2 leading-relaxed">{watch.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[var(--gold)]">
            <DollarSign size={14} />
            <span className="font-semibold text-sm">
              ${(watch.dailyRate / 100).toFixed(2)}<span className="text-[var(--muted-foreground)] text-xs">/day</span>
            </span>
          </div>
          <button
            onClick={onSelect}
            disabled={!watch.available}
            className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition-all ${
              watch.available
                ? "bg-[var(--gold)] text-[var(--smoky)] hover:bg-[var(--gold-deep)]"
                : "bg-[var(--jet)] text-[var(--muted-foreground)] cursor-not-allowed"
            }`}
          >
            {watch.available ? "Reserve" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage({ onSelectWatch }: { onSelectWatch?: (id: string) => void }) {
  const { watches } = useWatches();
  const [filter, setFilter] = useState<"all" | "available">("all");

  const filtered = filter === "available" ? watches.filter((w) => w.available) : watches;

  return (
    <div className="min-h-screen bg-[var(--smoky)]">
      <Navigation />
      <div className="page-container fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title">The Collection</h1>
          <p className="muted-text text-sm mt-1">Browse our private selection of fine timepieces</p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {[["all", "All Watches"], ["available", "Available Only"]].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === val
                  ? "bg-[var(--gold)] text-[var(--smoky)]"
                  : "bg-[var(--jet)] text-[var(--muted-foreground)] hover:text-[var(--ivory)]"
              }`}
            >
              {label}
            </button>
          ))}
          <span className="ml-auto flex items-center text-[var(--muted-foreground)] text-xs self-center">
            {filtered.length} piece{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="card-luxury py-16 text-center text-[var(--muted-foreground)]">
            <Watch size={40} className="mx-auto mb-3 opacity-30" />
            <p>No watches match your filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((w) => (
              <WatchCard key={w.id} watch={w} onSelect={() => onSelectWatch?.(w.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}