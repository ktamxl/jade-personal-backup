import { useState } from "react";
import { Watch } from "lucide-react";
import { APP_TITLE, USERS } from "../data/const";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [selectedUser, setSelectedUser] = useState(USERS[0].id);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = login(selectedUser, pin);
    if (!ok) setError("Incorrect PIN. Please try again.");
  }

  return (
    <div className="min-h-screen bg-[var(--smoky)] flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[var(--gold)] opacity-5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[var(--gold)] opacity-5 blur-3xl" />
      </div>

      <div className="w-full max-w-sm fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[var(--gold)] flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ boxShadow: "0 0 40px rgba(201,168,76,0.2)" }}>
            <Watch className="w-8 h-8 text-[var(--smoky)]" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[var(--ivory)]">{APP_TITLE}</h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-1">Private Watch Collection</p>
        </div>

        <div className="card-luxury p-6 shadow-2xl">
          <h2 className="text-lg font-semibold text-[var(--ivory)] mb-5">Access Your Collection</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Who Are You?</label>
              <div className="grid grid-cols-3 gap-2">
                {USERS.map((u) => (
                  <button key={u.id} type="button" onClick={() => { setSelectedUser(u.id); setError(""); }}
                    className={`py-2.5 rounded-lg text-xs font-semibold transition-all border ${selectedUser === u.id
                      ? "bg-[var(--gold)] text-[var(--smoky)] border-[var(--gold)]"
                      : "bg-[var(--jet)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--gold)]"
                    }`}>
                    {u.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider mb-2">PIN</label>
              <input type="password" value={pin} onChange={(e) => { setPin(e.target.value); setError(""); }}
                placeholder="Enter your PIN" maxLength={8} className="input-luxury text-center tracking-[0.3em] text-lg font-mono" autoFocus />
            </div>
            {error && <div className="bg-red-900/30 border border-red-800 rounded-lg px-4 py-2 text-red-400 text-sm text-center">{error}</div>}
            <button type="submit" className="btn-gold w-full justify-center py-3 text-base mt-2">Enter Collection</button>
          </form>
        </div>
        <p className="text-center text-[var(--muted-foreground)] text-xs mt-5">Private access only — unauthorized use is prohibited</p>
      </div>
    </div>
  );
}
