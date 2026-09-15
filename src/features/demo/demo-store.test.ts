import { describe, expect, it } from "vitest";

import {
  createDemoStore,
  createSubmissionId,
  DEMO_STORAGE_KEY,
  DemoStoreError,
  type StorageLike,
} from "./demo-store";

class MemoryStorage implements StorageLike {
  private readonly entries = new Map<string, string>();

  getItem(key: string): string | null {
    return this.entries.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.entries.set(key, value);
  }
}

const NOW = Date.parse("2026-09-14T16:00:00.000Z");
const createStore = (storage = new MemoryStorage()) =>
  createDemoStore({ storage, now: () => NOW });

describe("demo store", () => {
  it("round-trips a created sighting through the versioned local storage record", async () => {
    const storage = new MemoryStorage();
    const firstStore = createStore(storage);
    await firstStore.hydrate();

    const created = await firstStore.createSighting({
      animalType: "goose",
      count: 3,
      latitude: 43.6577,
      longitude: -79.3792,
      locationLabel: "Kerr Hall",
      submissionId: createSubmissionId(),
    });

    const secondStore = createStore(storage);
    await secondStore.hydrate();
    expect(secondStore.getSnapshot().sightings.find((sighting) => sighting.id === created.id)).toEqual(created);
  });

  it("seeds once and preserves a deliberately empty persisted feed", async () => {
    const storage = new MemoryStorage();
    storage.setItem(
      DEMO_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        initialized: true,
        seededAt: new Date(NOW).toISOString(),
        sightings: [],
        confirmations: [],
        profile: { id: "demo-alex", displayName: "Alex Chen", bio: "" },
        signedIn: true,
        submissions: {},
      }),
    );

    const store = createStore(storage);
    await store.hydrate();
    expect(store.getSnapshot().sightings).toEqual([]);
  });

  it("uses the submission id to make a retried create idempotent", async () => {
    const store = createStore();
    await store.hydrate();
    const draft = {
      animalType: "pigeon" as const,
      count: 2,
      latitude: 43.658,
      longitude: -79.38,
      submissionId: "same-request",
    };

    const first = await store.createSighting(draft);
    const retried = await store.createSighting(draft);
    expect(retried.id).toBe(first.id);
    expect(store.getSnapshot().sightings.filter((sighting) => sighting.id === first.id)).toHaveLength(1);
  });

  it("does not let Alex delete another student's sighting", async () => {
    const store = createStore();
    await store.hydrate();

    await expect(store.deleteSighting("seed-goose-kerr")).rejects.toMatchObject({
      code: "unauthorized",
    } satisfies Partial<DemoStoreError>);
    expect(store.getSnapshot().sightings.some((sighting) => sighting.id === "seed-goose-kerr")).toBe(true);
  });

  it("rejects self confirmation and keeps a duplicate confirmation to one record", async () => {
    const store = createStore();
    await store.hydrate();

    await expect(store.confirmSighting("seed-pigeon-scc")).rejects.toMatchObject({
      code: "self-confirmation",
    } satisfies Partial<DemoStoreError>);

    const first = await store.confirmSighting("seed-goose-kerr");
    const retried = await store.confirmSighting("seed-goose-kerr");
    expect(retried.id).toBe(first.id);
    expect(store.getSnapshot().confirmations).toHaveLength(1);
  });
});
