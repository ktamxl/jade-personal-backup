import Navigation from "../components/Navigation";
import { useAuth } from "../contexts/AuthContext";
import { Watch, Calendar, Shield, Star } from "lucide-react";

type Route = "home" | "catalog" | "my-reservations" | "admin" | "manage";

const HIGHLIGHTS = [
  { icon: <Watch size={22} />, title: "Curated Selection", desc: "Patek Philippe, Rolex, AP, Omega — only the finest pieces join this collection." },
  { icon: <Calendar size={22} />, title: "Simple Reservations", desc: "Pick your dates, confirm your booking. No paperwork. Up to 14 days per rental." },
  { icon: <Shield size={22} />, title: "Private & Secure", desc: "Access by invitation only. Your collection details stay completely private." },
];

const TESTIMONIALS = [
  { name: "Travis", text: "The Nautilus was absolutely stunning. An experience I'll never forget.", stars: 5 },
  { name: "Preston", text: "Super easy to reserve and the Submariner was in perfect condition. Highly recommend.", stars: 5 },
];

interface Props { onNavigate: (r: string) => void }

export default function HomePage({ onNavigate }: Props) {
  const { user, isOwner } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--smoky)]">
      <Navigation />
      <section className="relative overflow-hidden py-20 text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--gold)] opacity-3 blur-[120px]" />
        </div>
        <div className="relative page-container max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[var(--jet)] border border-[var(--border)] rounded-full px-4 py-1.5 mb-6">
            <Star size={12} className="text-[var(--gold)] fill-[var(--gold)]" />
            <span className="text-[var(--muted-foreground)] text-xs uppercase tracking-wider">Private Collection</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-[var(--ivory)] mb-4 leading-tight">
            Timepieces Worth<br /><span className="gold-text">Remembering</span>
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            An intimate collection of fine mechanical watches available exclusively for friends and family.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => onNavigate("catalog")} className="btn-gold px-8 py-3.5 text-base">
              View Collection
            </button>
            {isOwner && (
              <button onClick={() => onNavigate("admin")} className="btn-outline-gold px-8 py-3.5 text-base">
                Dashboard
              </button>
            )}
          </div>
          {user && (
            <p className="mt-4 text-[var(--muted-foreground)] text-sm">
              Welcome back, <span className="text-[var(--gold)]">{user.name}</span> ·{" "}
              <button onClick={() => onNavigate("my-reservations")} className="underline hover:text-[var(--ivory)]">View My Rentals</button>
            </p>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HIGHLIGHTS.map((h, i) => (
              <div key={i} className="card-luxury p-6 text-center hover:border-[var(--gold)] transition-all">
                <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/10 flex items-center justify-center mx-auto mb-4 text-[var(--gold)]">{h.icon}</div>
                <h3 className="font-serif text-lg font-bold text-[var(--ivory)] mb-2">{h.title}</h3>
                <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="page-container max-w-lg">
          <div className="card-luxury p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[var(--gold)]/10 flex items-center justify-center mx-auto mb-4">
              <Calendar size={24} className="text-[var(--gold)]" />
            </div>
            <div className="text-5xl font-bold gold-text mb-1">$2.00</div>
            <div className="text-[var(--muted-foreground)] text-sm mb-6">per day · flat rate · all watches</div>
            <div className="border-t border-[var(--jet)] pt-5 grid grid-cols-2 gap-3 text-left">
              {["All watches same rate","Maximum 14 days per rental","Calendar booking","Instant confirmation","Billing tracked","Easy returns"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-[var(--muted-foreground)] text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] shrink-0" />{f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 pb-24">
        <div className="page-container max-w-2xl">
          <h2 className="section-title text-center mb-8">What Members Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card-luxury p-5">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={12} className="text-[var(--gold)] fill-[var(--gold)]" />
                  ))}
                </div>
                <p className="text-[var(--ivory)] text-sm italic mb-3 leading-relaxed">"{t.text}"</p>
                <p className="text-[var(--gold)] text-xs font-semibold">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
