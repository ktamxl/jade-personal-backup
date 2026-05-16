import { useState, useCallback } from "react";
import {
  Watch, Reservation, SAMPLE_WATCHES, STORAGE_KEYS, generateId, isWithinDates,
} from "../data/const";

function loadWatches(): Watch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WATCHES);
    return raw ? JSON.parse(raw) : SAMPLE_WATCHES;
  } catch { return SAMPLE_WATCHES; }
}

function loadReservations(): Reservation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function useWatches() {
  const [watches, setWatches] = useState<Watch[]>(() => loadWatches());
  const [reservations, setReservations] = useState<Reservation[]>(() => loadReservations());

  const saveWatches = useCallback((list: Watch[]) => {
    setWatches(list);
    localStorage.setItem(STORAGE_KEYS.WATCHES, JSON.stringify(list));
  }, []);

  const saveReservations = useCallback((list: Reservation[]) => {
    setReservations(list);
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(list));
  }, []);

  // ── Watch CRUD (owner only) ────────────────────────────────────────────────
  const addWatch = useCallback((watch: Omit<Watch, "id" | "createdAt">) => {
    const newWatch: Watch = { ...watch, id: generateId(), createdAt: new Date().toISOString().split("T")[0] };
    saveWatches([...watches, newWatch]);
    return newWatch;
  }, [watches, saveWatches]);

  const updateWatch = useCallback((id: string, updates: Partial<Watch>) => {
    saveWatches(watches.map((w) => w.id === id ? { ...w, ...updates } : w));
  }, [watches, saveWatches]);

  const deleteWatch = useCallback((id: string) => {
    saveWatches(watches.filter((w) => w.id !== id));
  }, [watches, saveWatches]);

  // ── Reservations (members + owner) ───────────────────────────────────────────
  const createReservation = useCallback((res: Omit<Reservation, "id" | "createdAt" | "status">) => {
    // Check date conflict
    const conflict = reservations.some(
      (r) =>
        r.watchId === res.watchId &&
        r.status === "active" &&
        (isWithinDates(r.startDate, r.endDate, res.startDate) ||
          isWithinDates(r.startDate, r.endDate, res.endDate)),
    );
    if (conflict) throw new Error("Watch is already reserved for these dates.");

    const newRes: Reservation = {
      ...res,
      id: generateId(),
      status: "active",
      createdAt: new Date().toISOString(),
    };
    // Mark watch unavailable
    saveWatches(watches.map((w) => w.id === res.watchId ? { ...w, available: false } : w));
    saveReservations([...reservations, newRes]);
    return newRes;
  }, [watches, reservations, saveWatches, saveReservations]);

  const cancelReservation = useCallback((id: string) => {
    const res = reservations.find((r) => r.id === id);
    if (!res) return;
    saveReservations(reservations.map((r) => r.id === id ? { ...r, status: "cancelled" } : r));
    // Check if any other active reservations exist for this watch
    const stillActive = reservations.some(
      (r) => r.watchId === res.watchId && r.id !== id && r.status === "active",
    );
    if (!stillActive) {
      saveWatches(watches.map((w) => w.id === res.watchId ? { ...w, available: true } : w));
    }
  }, [reservations, watches, saveWatches, saveReservations]);

  const completeReservation = useCallback((id: string) => {
    const res = reservations.find((r) => r.id === id);
    if (!res) return;
    saveReservations(reservations.map((r) => r.id === id ? { ...r, status: "completed" } : r));
    const stillActive = reservations.some(
      (r) => r.watchId === res.watchId && r.id !== id && r.status === "active",
    );
    if (!stillActive) {
      saveWatches(watches.map((w) => w.id === res.watchId ? { ...w, available: true } : w));
    }
  }, [reservations, watches, saveWatches, saveReservations]);

  // Get reservation for a specific watch
  const getActiveReservation = useCallback(
    (watchId: string) => reservations.find((r) => r.watchId === watchId && r.status === "active"),
    [reservations],
  );

  const getMyReservations = useCallback(
    (userId: string) => reservations.filter((r) => r.borrowerId === userId),
    [reservations],
  );

  return {
    watches,
    reservations,
    addWatch,
    updateWatch,
    deleteWatch,
    createReservation,
    cancelReservation,
    completeReservation,
    getActiveReservation,
    getMyReservations,
  };
}