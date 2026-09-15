"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { createDemoStore, type DemoOperations, type DemoSnapshot } from "./demo-store";

const demoStore = createDemoStore();

export type UseDemoResult = DemoSnapshot & DemoOperations;

/**
 * Browser-only prototype state. It hydrates from one versioned localStorage
 * record after mount and keeps all mounted consumers in sync.
 */
export function useDemo(): UseDemoResult {
  const snapshot = useSyncExternalStore(
    demoStore.subscribe,
    demoStore.getSnapshot,
    demoStore.getServerSnapshot,
  );
  const [clockNow, setClockNow] = useState(snapshot.now);

  useEffect(() => {
    void demoStore.hydrate();
    const refreshClock = () => setClockNow(Date.now());
    refreshClock();
    const interval = window.setInterval(refreshClock, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return {
    ...snapshot,
    now: Math.max(snapshot.now, clockNow),
    hydrate: demoStore.hydrate,
    createSighting: demoStore.createSighting,
    deleteSighting: demoStore.deleteSighting,
    confirmSighting: demoStore.confirmSighting,
    undoConfirmation: demoStore.undoConfirmation,
    updateProfile: demoStore.updateProfile,
    setDemoSignedIn: demoStore.setDemoSignedIn,
    reset: demoStore.reset,
  };
}

export { demoStore };
