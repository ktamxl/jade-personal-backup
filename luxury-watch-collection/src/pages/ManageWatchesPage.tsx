import { useState } from "react";
import Navigation from "../components/Navigation";
import { useWatches } from "../hooks/useWatches";
import { Watch, Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { Watch as WatchType } from "../data/const";

function WatchForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: WatchType;
  onSave: (data: Omit<WatchType, "id" | "createdAt">) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [brand, setBrand] = useState(initial?.brand || "");
  const [model, setModel] = useState(initial?.model || "");
  const [reference, setReference] = useState(initial?.reference || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl || "");
  const [backImageUrl, setBackImageUrl] = useState(initial?.backImageUrl || "");
  const [dailyRate, setDailyRate] = useState(initial ? (initial.dailyRate / 100).toFixed(2) : "2.00");
  const [year, setYear] = useState(initial?.year || "");
  const [movement, setMovement] = useState(initial?.movement || "");
  const [caseSize, setCaseSize] = useState(initial?.caseSize || "");
  const [waterResistance, setWaterResistance] = useState(initial?.waterResistance || "");
  const [condition, setCondition] = useState(initial?.condition || "");
  const [available, setAvailable] = useState(initial?.available ?? true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      name, brand, model, reference, description,
      imageUrl, backImageUrl,
      dailyRate: Math.round(parseFloat(dailyRate || "2") * 100),
      year, movement, caseSize, waterResistance, condition,
      available,
    });
  }

  const grid = "grid-cols-2 gap-3";
  return (
    <div className="card-luxury p-5">
      <h3 className="font-serif text-lg font-bold text-[var(--ivory)] mb-5">{initial ? "Edit Watch" : "Add New Watch"}</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className={grid}>
          <div><label className="label-sm">Name</label><input value={name} onChange={(e) => setName(e.target.value)} className="input-luxury" placeholder="Nautilus" required /></div>
          <div><label className="label-sm">Brand</label><input value={brand} onChange={(e) => setBrand(e.target.value)} className="input-luxury" placeholder="Patek Philippe" required /></div>
        </div>
        <div className={grid}>
          <div><label className="label-sm">Model</label><input value={model} onChange={(e) => setModel(e.target.value)} className="input-luxury" placeholder="5711/1A-010" /></div>
          <div><label className="label-sm">Reference</label><input value={reference} onChange={(e) => setReference(e.target.value)} className="input-luxury" placeholder="5711/1A-010" /></div>
        </div>
        <div><label className="label-sm">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-luxury resize-none" rows={2} placeholder="Brief description of the watch..." /></div>
        <div><label className="label-sm">Front Image URL (iCloud / Google Photos)</label><input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="input-luxury" placeholder="https://..." /></div>
        <div><label className="label-sm">Back Image URL (optional)</label><input value={backImageUrl} onChange={(e) => setBackImageUrl(e.target.value)} className="input-luxury" placeholder="https://..." /></div>
        <div className={grid}>
          <div><label className="label-sm">Daily Rate (USD)</label><input type="number" step="0.01" min="0" value={dailyRate} onChange={(e) => setDailyRate(e.target.value)} className="input-luxury" /></div>
          <div><label className="label-sm">Year</label><input value={year} onChange={(e) => setYear(e.target.value)} className="input-luxury" placeholder="2021" /></div>
        </div>
        <div className={grid}>
          <div><label className="label-sm">Movement</label><input value={movement} onChange={(e) => setMovement(e.target.value)} className="input-luxury" placeholder="Automatic" /></div>
          <div><label className="label-sm">Case Size</label><input value={caseSize} onChange={(e) => setCaseSize(e.target.value)} className="input-luxury" placeholder="40mm" /></div>
        </div>
        <div className={grid}>
          <div><label className="label-sm">Water Resistance</label><input value={waterResistance} onChange={(e) => setWaterResistance(e.target.value)} className="input-luxury" placeholder="120m" /></div>
          <div><label className="label-sm">Condition</label><input value={condition} onChange={(e) => setCondition(e.target.value)} className="input-luxury" placeholder="Excellent" /></div>
        </div>
        <div className="flex items-center gap-3">
          <label className="label-sm mb-0">Available for rental</label>
          <button type="button" onClick={() => setAvailable(!available)}
            className={`w-11 h-6 rounded-full transition-colors ${available ? "bg-[var(--gold)]" : "bg-[var(--jet)]"} relative`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${available ? "left-6" : "left-1"}`} />
          </button>
          <span className="text-xs text-[var(--muted-foreground)]">{available ? "Yes" : "No"}</span>
        </div>
        <div className="flex gap-2 pt-2">
          <button type="submit" className="btn-gold px-5 py-2 text-sm"><Check size={14} /> Save</button>
          <button type="button" onClick={onCancel} className="btn-outline-gold px-5 py-2 text-sm"><X size={14} /> Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default function ManageWatchesPage() {
  const { watches, addWatch, updateWatch, deleteWatch } = useWatches();
  const [editing, setEditing] = useState<WatchType | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  function handleSave(data: Omit<WatchType, "id" | "createdAt">) {
    if (editing) {
      updateWatch(editing.id, data);
    } else {
      addWatch(data);
    }
    setEditing(null);
    setShowAdd(false);
  }

  return (
    <div className="min-h-screen bg-[var(--smoky)]">
      <Navigation />
      <div className="page-container fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="section-title">Manage Collection</h1>
            <p className="muted-text text-sm mt-1">{watches.length} timepiece{watches.length !== 1 ? "s" : ""} in collection</p>
          </div>
          {!showAdd && !editing && (
            <button onClick={() => setShowAdd(true)} className="btn-gold text-sm px-4 py-2">
              <Plus size={15} /> Add Watch
            </button>
          )}
        </div>

        {(showAdd || editing) && (
          <div className="mb-6">
            <WatchForm
              initial={editing || undefined}
              onSave={handleSave}
              onCancel={() => { setEditing(null); setShowAdd(false); }}
            />
          </div>
        )}

        <div className="space-y-4">
          {watches.map((w) => (
            <div key={w.id} className="card-luxury p-4 flex items-center gap-4 hover:border-[var(--gold)]/30 transition-all">
              <div className="w-16 h-16 rounded-xl bg-[var(--jet)] flex items-center justify-center flex-shrink-0 overflow-hidden">
                {w.imageUrl
                  ? <img src={w.imageUrl} alt={w.name} className="w-full h-full object-contain p-1" />
                  : <Watch size={22} className="text-[var(--gold)] opacity-40" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-[var(--ivory)]">{w.name}</span>
                  {w.available
                    ? <span className="badge-available">Available</span>
                    : <span className="badge-rented">Rented</span>
                  }
                </div>
                <div className="text-[var(--muted-foreground)] text-xs mt-0.5">{w.brand} · {w.model || w.reference || "—"}</div>
                <div className="text-[var(--gold)] text-xs mt-0.5">${(w.dailyRate / 100).toFixed(2)}/day</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditing(w)}
                  className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--ivory)] hover:bg-[var(--jet)] transition-colors">
                  <Pencil size={15} />
                </button>
                <button onClick={() => deleteWatch(w.id)}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-900/30 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
