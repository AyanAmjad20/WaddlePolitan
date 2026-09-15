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

class UnavailableStorage implements StorageLike {
  getItem(): string | null {
    throw new Error("storage disabled");
  }

  setItem(): void {
    throw new Error("storage disabled");
  }
}

const NOW = Date.parse("2026-09-14T16:00:00.000Z");
const createStore = (storage: StorageLike = new MemoryStorage()) =>
  createDemoStore({ storage, now: () => NOW });

describe("demo store", () => {
  it("starts signed out and round-trips a created sighting through the versioned local storage record", async () => {
    const storage = new MemoryStorage();
    const firstStore = createStore(storage);
    await firstStore.hydrate();
    expect(firstStore.getSnapshot().signedIn).toBe(false);
    await firstStore.setDemoSignedIn(true);

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
        signedIn: false,
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
    await store.setDemoSignedIn(true);
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
    await store.setDemoSignedIn(true);

    await expect(store.deleteSighting("seed-goose-kerr")).rejects.toMatchObject({
      code: "unauthorized",
    } satisfies Partial<DemoStoreError>);
    expect(store.getSnapshot().sightings.some((sighting) => sighting.id === "seed-goose-kerr")).toBe(true);
  });

  it("rejects self confirmation and keeps a duplicate confirmation to one record", async () => {
    const store = createStore();
    await store.hydrate();
    await store.setDemoSignedIn(true);

    await expect(store.confirmSighting("seed-pigeon-scc")).rejects.toMatchObject({
      code: "self-confirmation",
    } satisfies Partial<DemoStoreError>);

    const first = await store.confirmSighting("seed-goose-kerr");
    const retried = await store.confirmSighting("seed-goose-kerr");
    expect(retried.id).toBe(first.id);
    expect(store.getSnapshot().confirmations).toHaveLength(1);
  });

  it("rejects confirmations for sightings whose original observation is over an hour old", async () => {
    const store = createStore();
    await store.hydrate();
    await store.setDemoSignedIn(true);

    await expect(store.confirmSighting("seed-other-trsm")).rejects.toMatchObject({
      code: "validation",
    } satisfies Partial<DemoStoreError>);
  });

  it("cascades an owned sighting deletion to its confirmations and submission record", async () => {
    const storage = new MemoryStorage();
    const authorStore = createStore(storage);
    await authorStore.hydrate();
    await authorStore.setDemoSignedIn(true);
    const created = await authorStore.createSighting({
      animalType: "pigeon",
      count: 2,
      latitude: 43.658,
      longitude: -79.38,
      submissionId: "delete-me",
    });
    const persisted = JSON.parse(storage.getItem(DEMO_STORAGE_KEY) ?? "{}") as { confirmations: unknown[] };
    persisted.confirmations.push({
      id: "other-user-confirmation",
      sightingId: created.id,
      userId: "student-sam",
      createdAt: new Date(NOW).toISOString(),
    });
    storage.setItem(DEMO_STORAGE_KEY, JSON.stringify(persisted));

    const deletingStore = createStore(storage);
    await deletingStore.hydrate();
    await deletingStore.deleteSighting(created.id);
    expect(deletingStore.getSnapshot().sightings.some((sighting) => sighting.id === created.id)).toBe(false);
    expect(deletingStore.getSnapshot().confirmations.some((item) => item.sightingId === created.id)).toBe(false);
    expect(JSON.parse(storage.getItem(DEMO_STORAGE_KEY) ?? "{}").submissions["delete-me"]).toBeUndefined();
  });

  it("does not overwrite corrupt data until reset is explicitly requested", async () => {
    const storage = new MemoryStorage();
    const corrupt = "{not-json";
    storage.setItem(DEMO_STORAGE_KEY, corrupt);
    const store = createStore(storage);
    await store.hydrate();
    expect(store.getSnapshot().error?.code).toBe("storage-corrupt");

    await store.setDemoSignedIn(true);
    await store.createSighting({ animalType: "pigeon", count: 2, latitude: 43.658, longitude: -79.38 });
    expect(storage.getItem(DEMO_STORAGE_KEY)).toBe(corrupt);

    await store.reset();
    expect(storage.getItem(DEMO_STORAGE_KEY)).not.toBe(corrupt);
    expect(store.getSnapshot().signedIn).toBe(false);
  });

  it("uses in-memory session mode when storage is unavailable and preserves the warning", async () => {
    const store = createStore(new UnavailableStorage());
    await store.hydrate();
    expect(store.getSnapshot().error?.code).toBe("storage-unavailable");

    await store.setDemoSignedIn(true);
    const created = await store.createSighting({ animalType: "pigeon", count: 2, latitude: 43.658, longitude: -79.38 });
    expect(store.getSnapshot().sightings.some((sighting) => sighting.id === created.id)).toBe(true);
    expect(store.getSnapshot().error?.code).toBe("storage-unavailable");
  });

  it("leaves the snapshot unchanged when a quota write fails", async () => {
    const backing = new MemoryStorage();
    const initial = createStore(backing);
    await initial.hydrate();
    await initial.setDemoSignedIn(true);
    const quotaStorage: StorageLike = {
      getItem: backing.getItem.bind(backing),
      setItem: () => {
        const error = new Error("full");
        error.name = "QuotaExceededError";
        throw error;
      },
    };
    const store = createStore(quotaStorage);
    await store.hydrate();
    const countBefore = store.getSnapshot().sightings.length;
    await expect(
      store.createSighting({ animalType: "pigeon", count: 2, latitude: 43.658, longitude: -79.38 }),
    ).rejects.toMatchObject({ code: "storage-quota" });
    expect(store.getSnapshot().sightings).toHaveLength(countBefore);
  });

  it("validates observation windows, notes, and photo data URLs", async () => {
    const store = createStore();
    await store.hydrate();
    await store.setDemoSignedIn(true);
    const base = { animalType: "pigeon" as const, count: 2, latitude: 43.658, longitude: -79.38 };
    await expect(
      store.createSighting({ ...base, observedAt: new Date(NOW - 61 * 60_000).toISOString() }),
    ).rejects.toMatchObject({ code: "validation" });
    await expect(store.createSighting({ ...base, notes: "x".repeat(501) })).rejects.toMatchObject({
      code: "validation",
    });
    await expect(store.createSighting({ ...base, photos: ["data:image/svg+xml;base64,PHN2Zy8+"] })).rejects.toMatchObject({
      code: "validation",
    });
  });
});
