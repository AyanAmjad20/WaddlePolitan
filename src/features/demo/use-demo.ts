"use client";

import { useEffect, useSyncExternalStore } from "react";

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

  useEffect(() => {
    void demoStore.hydrate();
  }, []);

  return {
    ...snapshot,
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
