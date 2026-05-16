# Web App Template (Static Frontend)

Pure React + Tailwind template with shadcn/ui baked in. **Use this README as the checklist for shipping static experiences.**

> **Note:** This template includes a minimal `shared/` and `server/` directory with placeholder types to support imported templates. These are just compatibility placeholders - web-static remains a true static-only template without API functionality.

---

## 🤖 AI Development Guide

### Stack Overview
- Client-only routing powered by React + Wouter.
- Design tokens are provided through `client/src/index.css` and `tailwind.config.ts`—keep them intact.

### Component Patterns

```tsx
// Compose pages from shadcn/ui primitives
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="rounded-3xl bg-white p-10 shadow-xl">
      <h1 className="text-4xl font-bold text-slate-900">Launch Quickly</h1>
      <Button size="lg" className="mt-6">Get Started</Button>
    </section>
  );
}
```

### File Structure

```
client/
  public/         ← Static assets copied verbatim to '/'
  src/
    pages/        ← Page-level components
    components/   ← Reusable UI & shadcn/ui
    contexts/     ← React contexts
    hooks/        ← Custom React hooks
    lib/          ← Utility helpers
    App.tsx       ← Routes & top-level layout
    main.tsx      ← React entry point
    index.css     ← global style
server/         ← Placeholder for imported template compatibility
shared/         ← Placeholder for imported template compatibility
  const.ts      ← Shared constants
```

Assets placed under `client/public` are served with aggressive caching, so add a content hash to filenames (for example, `logo.3fa9b2e4.svg`) whenever you replace a file and update its references to avoid stale assets.

Files in `client/public` are available at the root of your site—reference them with absolute paths (`/logo.3fa9b2e4.svg`, `/robots.txt`, etc.) from HTML templates, JSX, or meta tags.

---

## 🎯 Development Workflow

1. **Compose pages** in `client/src/pages/`. Keep sections modular so they can be reused across routes.
2. **Share primitives** via `client/src/components/`—extend shadcn/ui when needed instead of duplicating markup.
3. **Keep styling consistent** by relying on existing Tailwind tokens (spacing, colors, typography).
4. **Fetch external data** with `useEffect` if the site needs dynamic content from public APIs.

---

## 🧱 Tailwind Safeguards

- Preserve the `@layer base` block in `client/src/index.css`; removing it breaks utilities like `border-border`.
- Do not strip values from `theme.extend` in `tailwind.config.ts`—they power the design tokens used in the UI kit.
- Stick to utility classes for responsiveness (mobile-first by default).
## ✅ Launch Checklist
- [ ] UI layout and navigation structure correct, all image src valid.
- [ ] Success + error paths verified in the browser

---

## 🎨 Frontend Best Practices (shadcn-first)

- Prefer shadcn/ui components for interactions to keep a modern, consistent look; import from `@/components/ui/*` (e.g., `button`, `card`, `dialog`).
- Compose Tailwind utilities with component variants for layout and states; avoid excessive custom CSS. Use built-in `variant`, `size`, etc. where available.
- Preserve design tokens: keep the `@layer base` rules in `client/src/index.css`. Utilities like `border-border` and `font-sans` depend on them.
- Consistent design language: use spacing, radius, shadows, and typography via tokens. Extract shared UI into `components/` for reuse instead of copy‑paste.
- Accessibility and responsiveness: keep visible focus rings and ensure keyboard reachability; design mobile‑first with thoughtful breakpoints.
- Theming: Choose dark/light theme to start with for ThemeProvider according to your design style (dark or light bg), then manage colors pallette with CSS variables in `client/src/index.css` instead of hard‑coding to keep global consistency;
- Micro‑interactions and empty states: add motion, empty states, and icons tastefully to improve quality without distracting from content.
- Navigation: Design clear and intuitive navigation structure appropriate for the app type (e.g., top/side nav for multi-page apps, breadcrumbs or contextual navigation for SPAs)'. When building dashboard-like experience, use sidebar-nav to keep all page entry easy to access.

**React component rules:**
- Never call setState/navigation in render phase → wrap in `useEffect`

---

## Common Pitfalls

### Infinite loading loops from unstable references
**Anti-pattern:** Creating new objects/arrays in render that are used as query inputs
```tsx
// ❌ Bad: New Date() creates new reference every render → infinite queries
const { data } = trpc.items.getByDate.useQuery({
  date: new Date(), // ← New object every render!
});

// ❌ Bad: Array/object literals in query input
const { data } = trpc.items.getByIds.useQuery({
  ids: [1, 2, 3], // ← New array reference every render!
});
```

**Correct approach:** Stabilize references with useState/useMemo
```tsx
// ✅ Good: Initialize once with useState
const [date] = useState(() => new Date());
const { data } = trpc.items.getByDate.useQuery({ date });

// ✅ Good: Memoize complex inputs
const ids = useMemo(() => [1, 2, 3], []);
const { data } = trpc.items.getByIds.useQuery({ ids });
```

**Why this happens:** TRPC queries trigger when input references change. Objects/arrays created in render have new references each time, causing infinite re-fetches.

### Navigation dead-ends in subpages
**Problem:** Creating nested routes without escape routes—no header nav, no sidebar, no back button.

**Solution:** Choose navigation based on app structure:
```tsx
// For dashboard/multi-section apps: Use persistent sidebar (from shadcn/ui)
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from "@/components/ui/sidebar";

<SidebarProvider>
  <Sidebar>
    <SidebarContent>
      {/* Navigation menu items - always visible */}
    </SidebarContent>
  </Sidebar>
  <SidebarInset>
    {children}  {/* Page content */}
  </SidebarInset>
</SidebarProvider>

// For linear flows (detail pages, wizards): Use back button
import { useRouter } from "wouter";

const router = useRouter();
<div>
  <Button variant="ghost" onClick={() => router.back()}>
    ← Back
  </Button>
  <ItemDetailPage />
</div>
```

### Dark mode styling without theme configuration
**Problem:** Using dark foreground colors without setting the theme, making text invisible on default light backgrounds.

**Solution:** Set `defaultTheme="dark"` in App.tsx, then update CSS variables in `index.css`:
```tsx
// App.tsx: Set the default theme first
<ThemeProvider defaultTheme="dark">  {/* Applies .dark class to root */}
  <div className="text-foreground bg-background">
    Content  {/* Now uses dark theme CSS variables */}
  </div>
</ThemeProvider>
```

```css
/* index.css: Adjust color palette for dark theme */
.dark {
  --background: oklch(0.145 0 0);  /* Dark background */
  --foreground: oklch(0.985 0 0);  /* Light text */
  /* ... other variables ... */
}
```

---

## Core File References

`client/src/App.tsx`
```tsx
import { useState } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import About from './components/sections/About';
import Resume from './components/sections/Resume';
import Portfolio from './components/sections/Portfolio';
import Blog from './components/sections/Blog';

function App() {
  const [activeSection, setActiveSection] = useState('about');

  // Function to dynamically render the appropriate section based on activeSection state
  const renderSection = () => {
    switch (activeSection) {
      case 'about':
        return <About />;
      case 'resume':
        return <Resume />;
      case 'portfolio':
        return <Portfolio />;
      case 'blog':
        return <Blog />;
      default:
        return <About />; // Fallback to About section if no valid section is selected
    }
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <div className="portfolio-container">
            <main className="portfolio-main">
              <Sidebar />
              <div className="main-content">
                <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
                {renderSection()}
              </div>
            </main>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;


```

`client/src/pages/Home.tsx`
```tsx
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE } from "@/const";

/**
 * Build polished static experiences. Visit the README for the full playbook.
 * All content in this page are only for example, delete if unneeded
 */
export default function Home() {
  // If theme is switchable in App.tsx, we can implement theme toggling like this:
  // const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full border-b px-4 flex items-center h-16">
        <div className="flex items-center gap-2">
          <img
            src={APP_LOGO}
            className="h-8 w-8 rounded-lg border-border bg-background object-cover"
          />
          <span className="text-xl font-bold">{APP_TITLE}</span>
        </div>
      </header>
      <main>
        Example Page
        <Button variant="default">Example Button</Button>
      </main>
    </div>
  );
}

```

`client/src/main.tsx`
```tsx
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

```

`client/src/index.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

@import "tailwindcss";

@layer base {
  :root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.145 0 0);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.145 0 0);
    --primary: oklch(0.205 0 0);
    --primary-foreground: oklch(0.985 0 0);
    --secondary: oklch(0.97 0 0);
    --secondary-foreground: oklch(0.205 0 0);
    --muted: oklch(0.97 0 0);
    --muted-foreground: oklch(0.556 0 0);
    --accent: oklch(0.97 0 0);
    --accent-foreground: oklch(0.205 0 0);
    --destructive: oklch(0.577 0.245 27.325);
    --destructive-foreground: oklch(0.985 0 0);
    --border: oklch(0.922 0 0);
    --input: oklch(0.922 0 0);
    --ring: oklch(0.708 0 0);
    --chart-1: oklch(0.646 0.222 41.116);
    --chart-2: oklch(0.6 0.118 184.704);
    --chart-3: oklch(0.398 0.07 227.392);
    --chart-4: oklch(0.828 0.189 84.429);
    --chart-5: oklch(0.769 0.188 70.08);
    --radius: 0.625rem;

    /* Portfolio color scheme */
    --bg-gradient-onyx: linear-gradient(to bottom right, hsl(240, 1%, 25%) 3%, hsl(0, 0%, 19%) 97%);
    --bg-gradient-jet: linear-gradient(to bottom right, hsla(240, 1%, 18%, 0.251) 0%, hsla(240, 2%, 11%, 0) 100%), hsl(240, 2%, 13%);
    --bg-gradient-yellow-1: linear-gradient(to bottom right, hsl(45, 100%, 71%) 0%, hsla(36, 100%, 69%, 0) 50%);
    --bg-gradient-yellow-2: linear-gradient(135deg, hsla(45, 100%, 71%, 0.251) 0%, hsla(35, 100%, 68%, 0) 59.86%), hsl(240, 2%, 13%);
    --border-gradient-onyx: linear-gradient(to bottom right, hsl(0, 0%, 25%) 0%, hsla(0, 0%, 25%, 0) 50%);
    --text-gradient-yellow: linear-gradient(to right, hsl(45, 100%, 72%), hsl(35, 100%, 68%));

    /* solid colors */
    --jet: hsl(0, 0%, 22%);
    --onyx: hsl(240, 1%, 17%);
    --eerie-black-1: hsl(240, 2%, 13%);
    --eerie-black-2: hsl(240, 2%, 12%);
    --smoky-black: hsl(0, 0%, 7%);
    --white-1: hsl(0, 0%, 100%);
    --white-2: hsl(0, 0%, 98%);
    --orange-yellow-crayola: hsl(45, 100%, 72%);
    --vegas-gold: hsl(45, 54%, 58%);
    --light-gray: hsl(0, 0%, 84%);
    --light-gray-70: hsla(0, 0%, 84%, 0.7);
    --bittersweet-shimmer: hsl(0, 43%, 51%);

    /* typography */
    --ff-poppins: 'Poppins', sans-serif;
    --fs-1: 24px;
    --fs-2: 18px;
    --fs-3: 17px;
    --fs-4: 16px;
    --fs-5: 15px;
    --fs-6: 14px;
    --fs-7: 13px;
    --fs-8: 11px;
    --fw-300: 300;
    --fw-400: 400;
    --fw-500: 500;
    --fw-600: 600;

    /* shadows */
    --shadow-1: -4px 8px 24px hsla(0, 0%, 0%, 0.25);
    --shadow-2: 0 16px 30px hsla(0, 0%, 0%, 0.25);
    --shadow-3: 0 16px 40px hsla(0, 0%, 0%, 0.25);
    --shadow-4: 0 25px 50px hsla(0, 0%, 0%, 0.15);
    --shadow-5: 0 24px 80px hsla(0, 0%, 0%, 0.25);

    /* transitions */
    --transition-1: 0.25s ease;
    --transition-2: 0.5s ease-in-out;
  }

  .dark {
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    --card: oklch(0.205 0 0);
    --card-foreground: oklch(0.985 0 0);
    --popover: oklch(0.205 0 0);
    --popover-foreground: oklch(0.985 0 0);
    --primary: oklch(0.922 0 0);
    --primary-foreground: oklch(0.205 0 0);
    --secondary: oklch(0.269 0 0);
    --secondary-foreground: oklch(0.985 0 0);
    --muted: oklch(0.269 0 0);
    --muted-foreground: oklch(0.708 0 0);
    --accent: oklch(0.269 0 0);
    --accent-foreground: oklch(0.985 0 0);
    --destructive: oklch(0.704 0.191 22.216);
    --destructive-foreground: oklch(0.985 0 0);
    --border: oklch(1 0 0 / 10%);
    --input: oklch(1 0 0 / 15%);
    --ring: oklch(0.556 0 0);
    --chart-1: oklch(0.488 0.243 264.376);
    --chart-2: oklch(0.696 0.17 162.48);
    --chart-3: oklch(0.769 0.188 70.08);
    --chart-4: oklch(0.627 0.265 303.9);
    --chart-5: oklch(0.645 0.246 16.439);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  *:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }

  body {
    background: var(--smoky-black);
    color: var(--white-1);
    font-family: var(--ff-poppins);
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  li {
    list-style: none;
  }

  img, button, time, span {
    display: block;
  }

  button {
    font: inherit;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
  }

  input, textarea {
    display: block;
    width: 100%;
    background: none;
    font: inherit;
  }

  ::selection {
    background: var(--orange-yellow-crayola);
    color: var(--smoky-black);
  }

  :focus {
    outline-color: var(--orange-yellow-crayola);
  }
}

/* Portfolio-specific styles */
.portfolio-container {
  min-height: 100vh;
  padding: 12px;
  margin: 0 auto;
  max-width: 1200px;
}

.portfolio-main {
  display: flex;
  gap: 25px;
  align-items: flex-start;
}

.sidebar {
  background: var(--eerie-black-2);
  border: 1px solid var(--jet);
  border-radius: 20px;
  padding: 15px;
  box-shadow: var(--shadow-1);
  z-index: 1;
  position: sticky;
  top: 12px;
  min-width: 300px;
}

.main-content {
  flex: 1;
  background: var(--eerie-black-2);
  border: 1px solid var(--jet);
  border-radius: 20px;
  padding: 15px;
  box-shadow: var(--shadow-1);
  z-index: 1;
}

.separator {
  width: 100%;
  height: 1px;
  background: var(--jet);
  margin: 16px 0;
}

.icon-box {
  position: relative;
  background: var(--border-gradient-onyx);
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: var(--orange-yellow-crayola);
  box-shadow: var(--shadow-1);
  z-index: 1;
}

.icon-box::before {
  content: "";
  position: absolute;
  inset: 1px;
  background: var(--eerie-black-1);
  border-radius: inherit;
  z-index: -1;
}

/* Typography */
.h2 {
  color: var(--white-2);
  font-size: var(--fs-1);
  font-weight: var(--fw-600);
}

.h3 {
  color: var(--white-2);
  font-size: var(--fs-2);
  font-weight: var(--fw-500);
}

.h4 {
  color: var(--white-2);
  font-size: var(--fs-4);
  font-weight: var(--fw-500);
}

.h5 {
  color: var(--white-2);
  font-size: var(--fs-7);
  font-weight: var(--fw-500);
}

/* Article styles */
.article-title {
  position: relative;
  padding-bottom: 7px;
  margin-bottom: 30px;
}

.article-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 3px;
  background: var(--text-gradient-yellow);
  border-radius: 3px;
}

/* Avatar styles */
.avatar-box {
  background: var(--bg-gradient-onyx);
  border-radius: 20px;
  padding: 15px;
}

/* Custom color classes */
.text-orange-yellow-crayola {
  color: var(--orange-yellow-crayola);
}

.text-vegas-gold {
  color: var(--vegas-gold);
}

.text-light-gray {
  color: var(--light-gray);
}

.text-light-gray-70 {
  color: var(--light-gray-70);
}

.text-white-1 {
  color: var(--white-1);
}

.text-white-2 {
  color: var(--white-2);
}

.text-smoky-black {
  color: var(--smoky-black);
}

.bg-orange-yellow-crayola {
  background-color: var(--orange-yellow-crayola);
}

.bg-vegas-gold {
  background-color: var(--vegas-gold);
}

.bg-jet {
  background-color: var(--jet);
}

.bg-onyx {
  background-color: var(--onyx);
}

.bg-eerie-black-1 {
  background-color: var(--eerie-black-1);
}

.bg-eerie-black-2 {
  background-color: var(--eerie-black-2);
}

.bg-smoky-black {
  background-color: var(--smoky-black);
}

.border-jet {
  border-color: var(--jet);
}

.border-orange-yellow-crayola {
  border-color: var(--orange-yellow-crayola);
}

/* Gradient utilities */
.from-orange-yellow-crayola {
  --tw-gradient-from: var(--orange-yellow-crayola);
}

.to-vegas-gold {
  --tw-gradient-to: var(--vegas-gold);
}

.from-jet {
  --tw-gradient-from: var(--jet);
}

.to-onyx {
  --tw-gradient-to: var(--onyx);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .portfolio-main {
    flex-direction: column;
  }
  
  .sidebar {
    position: relative;
    min-width: auto;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .portfolio-container {
    padding: 8px;
  }
  
  .portfolio-main {
    gap: 15px;
  }
  
  .sidebar,
  .main-content {
    padding: 12px;
  }
}

/* Animation for skill progress bars */
@keyframes fillProgress {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

.skill-progress-fill {
  animation: fillProgress 1.5s ease-out;
  animation-fill-mode: forwards;
}

/* Progress bar styling */
.skill-progress-bg {
  background: var(--jet);
  border-radius: 10px;
  overflow: hidden;
}

.skill-progress-fill {
  border-radius: inherit;
  transition: width 0.3s ease;
}

/* Hover effects */
.hover-lift {
  transition: transform 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
}

/* Scrollbar styles */
.has-scrollbar::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.has-scrollbar::-webkit-scrollbar-track {
  background: var(--onyx);
  border-radius: 5px;
}

.has-scrollbar::-webkit-scrollbar-thumb {
  background: var(--orange-yellow-crayola);
  border-radius: 5px;
}

.has-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--vegas-gold);
}

/* Filter transition effects */
.project-item {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.project-item.filtered-out {
  opacity: 0;
  transform: scale(0.8);
  pointer-events: none;
}


```

