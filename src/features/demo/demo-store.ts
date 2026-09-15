import type {
  AnimalType,
  CampusLocation,
  Confirmation,
  DemoProfile,
  Sighting,
  SightingDraft,
} from "@/types/sighting";

export const DEMO_STORAGE_KEY = "waddlepolitan.demo.v1";
const DEMO_STORAGE_VERSION = 1;
const MAX_PHOTOS = 3;
const MAX_PHOTO_DATA_URL_LENGTH = 900_000;
const MAX_NOTES_LENGTH = 500;
const MAX_LOCATION_LABEL_LENGTH = 100;
const ACTIVE_WINDOW_MS = 60 * 60_000;
const MAX_FUTURE_OBSERVATION_MS = 5 * 60_000;
const IMAGE_DATA_URL = /^data:image\/(?:jpeg|png|webp);base64,[a-z0-9+/]+={0,2}$/i;

export const DEMO_USER: DemoProfile = {
  id: "demo-alex",
  displayName: "Alex Chen",
  bio: "TMU student and campus animal spotter.",
};

/**
 * Prototype pins for composing the local demo. They are intentionally not a
 * campus boundary or an authoritative TMU location dataset.
 */
export const CAMPUS_LOCATIONS: readonly CampusLocation[] = [
  {
    id: "kerr-hall",
    label: "Kerr Hall",
    latitude: 43.65769,
    longitude: -79.37913,
    isPrototypeCoordinate: true,
  },
  {
    id: "scc",
    label: "Student Campus Centre",
    latitude: 43.6581,
    longitude: -79.38029,
    isPrototypeCoordinate: true,
  },
  {
    id: "eng-building",
    label: "Engineering Building",
    latitude: 43.65877,
    longitude: -79.37901,
    isPrototypeCoordinate: true,
  },
  {
    id: "ted-rogers",
    label: "Ted Rogers School of Management",
    latitude: 43.65589,
    longitude: -79.38047,
    isPrototypeCoordinate: true,
  },
];

export type DemoStoreErrorCode =
  | "storage-unavailable"
  | "storage-corrupt"
  | "storage-quota"
  | "validation"
  | "unauthorized"
  | "not-found"
  | "self-confirmation";

export class DemoStoreError extends Error {
  readonly code: DemoStoreErrorCode;

  constructor(code: DemoStoreErrorCode, message: string) {
    super(message);
    this.name = "DemoStoreError";
    this.code = code;
  }
}

export type DemoSnapshot = {
  sightings: readonly Sighting[];
  confirmations: readonly Confirmation[];
  profile: DemoProfile;
  signedIn: boolean;
  ready: boolean;
  error: DemoStoreError | null;
  now: number;
};

export type DemoOperations = {
  hydrate: () => Promise<void>;
  createSighting: (draft: SightingDraft) => Promise<Sighting>;
  deleteSighting: (sightingId: string) => Promise<void>;
  confirmSighting: (sightingId: string) => Promise<Confirmation>;
  undoConfirmation: (sightingId: string) => Promise<void>;
  updateProfile: (profile: Pick<DemoProfile, "displayName" | "bio">) => Promise<DemoProfile>;
  setDemoSignedIn: (signedIn: boolean) => Promise<void>;
  reset: () => Promise<void>;
};

export type DemoStore = DemoOperations & {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => DemoSnapshot;
  getServerSnapshot: () => DemoSnapshot;
};

type PersistedDemoData = {
  version: number;
  initialized: true;
  seededAt: string;
  sightings: Sighting[];
  confirmations: Confirmation[];
  profile: DemoProfile;
  signedIn: boolean;
  submissions: Record<string, string>;
};

export type StorageLike = Pick<Storage, "getItem" | "setItem">;

export type CreateDemoStoreOptions = {
  storage?: StorageLike | null;
  now?: () => number;
};

const SERVER_SNAPSHOT: DemoSnapshot = {
  sightings: [],
  confirmations: [],
  profile: DEMO_USER,
  signedIn: false,
  ready: false,
  error: null,
  now: 0,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isAnimalType = (value: unknown): value is AnimalType =>
  value === "goose" || value === "pigeon" || value === "other";

const isIsoDate = (value: unknown): value is string =>
  typeof value === "string" && Number.isFinite(Date.parse(value));

function isSighting(value: unknown): value is Sighting {
  if (!isRecord(value) || !isRecord(value.author)) return false;

  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.author.id) &&
    isNonEmptyString(value.author.displayName) &&
    isAnimalType(value.animalType) &&
    isFiniteNumber(value.count) &&
    Number.isInteger(value.count) &&
    value.count > 0 &&
    isFiniteNumber(value.latitude) &&
    value.latitude >= -90 &&
    value.latitude <= 90 &&
    isFiniteNumber(value.longitude) &&
    value.longitude >= -180 &&
    value.longitude <= 180 &&
    typeof value.locationLabel === "string" &&
    typeof value.notes === "string" &&
    Array.isArray(value.photos) &&
    value.photos.every((photo) => typeof photo === "string") &&
    isIsoDate(value.observedAt) &&
    isIsoDate(value.createdAt)
  );
}

function isConfirmation(value: unknown): value is Confirmation {
  return (
    isRecord(value) &&
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.sightingId) &&
    isNonEmptyString(value.userId) &&
    isIsoDate(value.createdAt)
  );
}

function isProfile(value: unknown): value is DemoProfile {
  return (
    isRecord(value) &&
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.displayName) &&
    typeof value.bio === "string"
  );
}

function isPersistedDemoData(value: unknown): value is PersistedDemoData {
  if (!isRecord(value)) return false;
  if (
    value.version !== DEMO_STORAGE_VERSION ||
    value.initialized !== true ||
    !isIsoDate(value.seededAt) ||
    !Array.isArray(value.sightings) ||
    !Array.isArray(value.confirmations) ||
    !isProfile(value.profile) ||
    typeof value.signedIn !== "boolean" ||
    !isRecord(value.submissions)
  ) {
    return false;
  }

  if (!value.sightings.every(isSighting) || !value.confirmations.every(isConfirmation)) {
    return false;
  }

  const sightingIds = new Set(value.sightings.map((sighting) => sighting.id));
  const confirmationKeys = new Set<string>();
  for (const confirmation of value.confirmations) {
    if (!sightingIds.has(confirmation.sightingId)) return false;
    const key = `${confirmation.sightingId}:${confirmation.userId}`;
    if (confirmationKeys.has(key)) return false;
    confirmationKeys.add(key);
  }

  return Object.entries(value.submissions).every(
    ([submissionId, sightingId]) =>
      isNonEmptyString(submissionId) && typeof sightingId === "string" && sightingIds.has(sightingId),
  );
}

function makeId(prefix: string, now: number): string {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${now.toString(36)}-${random}`;
}

export function createSubmissionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return makeId("submission", Date.now());
}

function buildSeedData(now: number): PersistedDemoData {
  const createdAt = new Date(now).toISOString();
  const minutesAgo = (minutes: number) => new Date(now - minutes * 60_000).toISOString();

  return {
    version: DEMO_STORAGE_VERSION,
    initialized: true,
    seededAt: createdAt,
    profile: { ...DEMO_USER },
    signedIn: false,
    submissions: {},
    sightings: [
      {
        id: "seed-goose-kerr",
        author: { id: "student-maya", displayName: "Maya Singh" },
        animalType: "goose",
        count: 5,
        latitude: 43.65776,
        longitude: -79.37925,
        locationLabel: "Kerr Hall quad",
        notes: "A small group near the benches.",
        photos: [],
        observedAt: minutesAgo(4),
        createdAt,
      },
      {
        id: "seed-goose-kerr-overlap",
        author: { id: "student-noah", displayName: "Noah Patel" },
        animalType: "goose",
        count: 6,
        latitude: 43.65776,
        longitude: -79.37925,
        locationLabel: "Kerr Hall quad",
        notes: "The group is still near the benches.",
        photos: [],
        observedAt: minutesAgo(6),
        createdAt,
      },
      {
        id: "seed-goose-kerr-nearby",
        author: { id: "student-riley", displayName: "Riley Morgan" },
        animalType: "goose",
        count: 5,
        latitude: 43.65781,
        longitude: -79.37919,
        locationLabel: "Kerr Hall quad",
        notes: "Near the west path.",
        photos: [],
        observedAt: minutesAgo(8),
        createdAt,
      },
      {
        id: "seed-pigeon-scc",
        author: { id: "demo-alex", displayName: "Alex Chen" },
        animalType: "pigeon",
        count: 9,
        latitude: 43.65803,
        longitude: -79.38017,
        locationLabel: "Student Campus Centre",
        notes: "Gathered by the east entrance.",
        photos: [],
        observedAt: minutesAgo(12),
        createdAt,
      },
      {
        id: "seed-other-trsm",
        author: { id: "student-jordan", displayName: "Jordan Williams" },
        animalType: "other",
        count: 1,
        latitude: 43.65597,
        longitude: -79.38039,
        locationLabel: "Ted Rogers School of Management",
        notes: "A squirrel at the planters.",
        photos: [],
        observedAt: minutesAgo(74),
        createdAt,
      },
    ],
    confirmations: [],
  };
}

function toSnapshot(data: PersistedDemoData, ready: boolean, error: DemoStoreError | null, now: number): DemoSnapshot {
  return {
    sightings: [...data.sightings].sort(
      (left, right) => Date.parse(right.observedAt) - Date.parse(left.observedAt),
    ),
    confirmations: [...data.confirmations].sort(
      (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt),
    ),
    profile: { ...data.profile },
    signedIn: data.signedIn,
    ready,
    error,
    now,
  };
}

function resolveBrowserStorage(): StorageLike | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function storageError(error: unknown): DemoStoreError {
  const name = error instanceof Error ? error.name : "";
  if (name === "QuotaExceededError" || name === "NS_ERROR_DOM_QUOTA_REACHED") {
    return new DemoStoreError(
      "storage-quota",
      "Your browser has no room for another demo update. Remove photos or reset the demo and try again.",
    );
  }
  return new DemoStoreError(
    "storage-unavailable",
    "This browser is not allowing local demo storage. Your changes can only last for this session.",
  );
}

function validateDraft(draft: SightingDraft, now: number): void {
  if (!isAnimalType(draft.animalType)) {
    throw new DemoStoreError("validation", "Choose goose, pigeon, or other.");
  }
  if (!Number.isInteger(draft.count) || draft.count < 1 || draft.count > 999) {
    throw new DemoStoreError("validation", "Enter a whole animal count from 1 to 999.");
  }
  if (!Number.isFinite(draft.latitude) || draft.latitude < -90 || draft.latitude > 90) {
    throw new DemoStoreError("validation", "Choose a valid map latitude.");
  }
  if (!Number.isFinite(draft.longitude) || draft.longitude < -180 || draft.longitude > 180) {
    throw new DemoStoreError("validation", "Choose a valid map longitude.");
  }
  const observedAt = draft.observedAt ?? new Date(now).toISOString();
  const observedAtTime = Date.parse(observedAt);
  if (
    !Number.isFinite(observedAtTime) ||
    observedAtTime < now - ACTIVE_WINDOW_MS ||
    observedAtTime > now + MAX_FUTURE_OBSERVATION_MS
  ) {
    throw new DemoStoreError("validation", "Choose an observation time from the last hour.");
  }
  if ((draft.locationLabel?.trim().length ?? 0) > MAX_LOCATION_LABEL_LENGTH) {
    throw new DemoStoreError("validation", "Keep the location label under 100 characters.");
  }
  if ((draft.notes?.trim().length ?? 0) > MAX_NOTES_LENGTH) {
    throw new DemoStoreError("validation", "Keep notes under 500 characters.");
  }
  if ((draft.photos?.length ?? 0) > MAX_PHOTOS) {
    throw new DemoStoreError("validation", `Add up to ${MAX_PHOTOS} photos.`);
  }
  for (const photo of draft.photos ?? []) {
    if (!IMAGE_DATA_URL.test(photo) || photo.length > MAX_PHOTO_DATA_URL_LENGTH) {
      throw new DemoStoreError(
        "validation",
        "Use a compressed image under the prototype photo size limit.",
      );
    }
  }
}

export function getLastSeenAt(sighting: Sighting, confirmations: readonly Confirmation[]): string {
  return confirmations
    .filter((confirmation) => confirmation.sightingId === sighting.id)
    .reduce(
      (latest, confirmation) =>
        Date.parse(confirmation.createdAt) > Date.parse(latest) ? confirmation.createdAt : latest,
      sighting.observedAt,
    );
}

export function isSightingActive(sighting: Sighting, confirmations: readonly Confirmation[], now = Date.now()): boolean {
  return now - Date.parse(getLastSeenAt(sighting, confirmations)) <= ACTIVE_WINDOW_MS;
}

export function formatRelativeTime(timestamp: string, now = Date.now()): string {
  const minutes = Math.max(0, Math.floor((now - Date.parse(timestamp)) / 60_000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function createDemoStore(options: CreateDemoStoreOptions = {}): DemoStore {
  const getNow = options.now ?? Date.now;
  const storage = options.storage === undefined ? resolveBrowserStorage() : options.storage;
  let data = buildSeedData(getNow());
  let snapshot = SERVER_SNAPSHOT;
  let hydrated = false;
  let storageListenerAttached = false;
  let persistenceMode: "persistent" | "session" | "corrupt" = storage ? "persistent" : "session";
  const listeners = new Set<() => void>();

  const persistenceWarning = (): DemoStoreError | null => {
    if (persistenceMode === "session") {
      return new DemoStoreError(
        "storage-unavailable",
        "This browser is not allowing local demo storage. Your changes only last for this session.",
      );
    }
    if (persistenceMode === "corrupt") {
      return new DemoStoreError(
        "storage-corrupt",
        "Saved demo data could not be read. Reset the demo to replace it; current changes only last for this session.",
      );
    }
    return null;
  };

  const publish = (error: DemoStoreError | null = null) => {
    snapshot = toSnapshot(data, hydrated, error ?? persistenceWarning(), getNow());
    listeners.forEach((listener) => listener());
  };

  const readStoredData = (): PersistedDemoData | null => {
    if (!storage) {
      throw new DemoStoreError(
        "storage-unavailable",
        "This browser is not allowing local demo storage. Your changes can only last for this session.",
      );
    }
    let raw: string | null;
    try {
      raw = storage.getItem(DEMO_STORAGE_KEY);
    } catch (error) {
      throw storageError(error);
    }
    if (raw === null) return null;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!isPersistedDemoData(parsed)) {
        throw new Error("Stored data did not match the demo schema.");
      }
      return parsed;
    } catch {
      throw new DemoStoreError(
        "storage-corrupt",
        "Saved demo data could not be read. Reset the demo to start a fresh local prototype.",
      );
    }
  };

  const writeStoredData = (next: PersistedDemoData): void => {
    if (!storage) {
      throw new DemoStoreError(
        "storage-unavailable",
        "This browser is not allowing local demo storage. Your changes can only last for this session.",
      );
    }
    try {
      storage.setItem(DEMO_STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      throw storageError(error);
    }
  };

  const attachStorageListener = () => {
    if (storageListenerAttached || typeof window === "undefined") return;
    window.addEventListener("storage", (event) => {
      if (event.key !== DEMO_STORAGE_KEY) return;
      if (event.newValue === null) {
        data = buildSeedData(getNow());
        persistenceMode = "persistent";
        publish(null);
        return;
      }
      try {
        const parsed: unknown = JSON.parse(event.newValue);
        if (!isPersistedDemoData(parsed)) throw new Error("Invalid storage event payload.");
        data = parsed;
        persistenceMode = "persistent";
        publish(null);
      } catch {
        persistenceMode = "corrupt";
        publish(null);
      }
    });
    storageListenerAttached = true;
  };

  const hydrate = async (): Promise<void> => {
    if (hydrated) return;
    hydrated = true;
    attachStorageListener();
    try {
      const stored = readStoredData();
      if (stored) {
        data = stored;
        publish(null);
        return;
      }
      const seeded = buildSeedData(getNow());
      try {
        writeStoredData(seeded);
      } catch (error) {
        data = seeded;
        const demoError = error instanceof DemoStoreError ? error : storageError(error);
        if (demoError.code === "storage-unavailable") persistenceMode = "session";
        publish(demoError);
        return;
      }
      data = seeded;
      publish(null);
    } catch (error) {
      const demoError = error instanceof DemoStoreError ? error : storageError(error);
      if (demoError.code === "storage-corrupt") {
        persistenceMode = "corrupt";
        data = buildSeedData(getNow());
      } else {
        persistenceMode = "session";
      }
      publish(demoError);
    }
  };

  const ensureHydrated = async () => {
    await hydrate();
  };

  const commit = (next: PersistedDemoData): void => {
    if (persistenceMode !== "persistent") {
      data = next;
      publish(null);
      return;
    }
    try {
      writeStoredData(next);
    } catch (error) {
      const demoError = error instanceof DemoStoreError ? error : storageError(error);
      if (demoError.code === "storage-unavailable") persistenceMode = "session";
      publish(demoError);
      throw demoError;
    }
    data = next;
    publish(null);
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => snapshot,
    getServerSnapshot: () => SERVER_SNAPSHOT,
    hydrate,
    async createSighting(draft) {
      await ensureHydrated();
      const now = getNow();
      validateDraft(draft, now);
      if (!data.signedIn) {
        throw new DemoStoreError("unauthorized", "Sign in to add a sighting in the demo.");
      }

      const submissionId = draft.submissionId?.trim() || createSubmissionId();
      const existingSightingId = data.submissions[submissionId];
      if (existingSightingId) {
        const existing = data.sightings.find((sighting) => sighting.id === existingSightingId);
        if (existing) return existing;
      }

      const sighting: Sighting = {
        id: makeId("sighting", now),
        author: { id: data.profile.id, displayName: data.profile.displayName },
        animalType: draft.animalType,
        count: draft.count,
        latitude: draft.latitude,
        longitude: draft.longitude,
        locationLabel: draft.locationLabel?.trim() ?? "",
        notes: draft.notes?.trim() ?? "",
        photos: [...(draft.photos ?? [])],
        observedAt: draft.observedAt ?? new Date(now).toISOString(),
        createdAt: new Date(now).toISOString(),
      };
      commit({
        ...data,
        sightings: [...data.sightings, sighting],
        submissions: { ...data.submissions, [submissionId]: sighting.id },
      });
      return sighting;
    },
    async deleteSighting(sightingId) {
      await ensureHydrated();
      if (!data.signedIn) {
        throw new DemoStoreError("unauthorized", "Sign in to delete a sighting in the demo.");
      }
      const sighting = data.sightings.find((candidate) => candidate.id === sightingId);
      if (!sighting) return;
      if (sighting.author.id !== data.profile.id) {
        throw new DemoStoreError("unauthorized", "You can only delete your own sightings.");
      }
      const submissions = Object.fromEntries(
        Object.entries(data.submissions).filter(([, submittedSightingId]) => submittedSightingId !== sightingId),
      );
      commit({
        ...data,
        sightings: data.sightings.filter((candidate) => candidate.id !== sightingId),
        confirmations: data.confirmations.filter(
          (confirmation) => confirmation.sightingId !== sightingId,
        ),
        submissions,
      });
    },
    async confirmSighting(sightingId) {
      await ensureHydrated();
      if (!data.signedIn) {
        throw new DemoStoreError("unauthorized", "Sign in to confirm a sighting in the demo.");
      }
      const sighting = data.sightings.find((candidate) => candidate.id === sightingId);
      if (!sighting) throw new DemoStoreError("not-found", "That sighting is no longer available.");
      if (sighting.author.id === data.profile.id) {
        throw new DemoStoreError("self-confirmation", "You cannot confirm your own sighting.");
      }
      if (getNow() - Date.parse(sighting.observedAt) > ACTIVE_WINDOW_MS) {
        throw new DemoStoreError(
          "validation",
          "This sighting is more than an hour old and can no longer be confirmed.",
        );
      }
      const existing = data.confirmations.find(
        (confirmation) => confirmation.sightingId === sightingId && confirmation.userId === data.profile.id,
      );
      if (existing) return existing;

      const confirmation: Confirmation = {
        id: makeId("confirmation", getNow()),
        sightingId,
        userId: data.profile.id,
        createdAt: new Date(getNow()).toISOString(),
      };
      commit({ ...data, confirmations: [...data.confirmations, confirmation] });
      return confirmation;
    },
    async undoConfirmation(sightingId) {
      await ensureHydrated();
      if (!data.signedIn) {
        throw new DemoStoreError("unauthorized", "Sign in to change a confirmation in the demo.");
      }
      const ownConfirmation = data.confirmations.find(
        (confirmation) => confirmation.sightingId === sightingId && confirmation.userId === data.profile.id,
      );
      if (!ownConfirmation) return;
      commit({
        ...data,
        confirmations: data.confirmations.filter((confirmation) => confirmation.id !== ownConfirmation.id),
      });
    },
    async updateProfile(profile) {
      await ensureHydrated();
      if (!data.signedIn) {
        throw new DemoStoreError("unauthorized", "Sign in to update the demo profile.");
      }
      const displayName = profile.displayName.trim();
      const bio = profile.bio.trim();
      if (displayName.length < 2 || displayName.length > 40 || bio.length > 180) {
        throw new DemoStoreError("validation", "Use a 2–40 character name and a bio under 180 characters.");
      }
      const nextProfile = { ...data.profile, displayName, bio };
      commit({ ...data, profile: nextProfile });
      return nextProfile;
    },
    async setDemoSignedIn(signedIn) {
      await ensureHydrated();
      commit({ ...data, signedIn });
    },
    async reset() {
      await ensureHydrated();
      const resetData = buildSeedData(getNow());
      if (persistenceMode === "corrupt") {
        try {
          writeStoredData(resetData);
          persistenceMode = "persistent";
          data = resetData;
          publish(null);
        } catch (error) {
          const demoError = error instanceof DemoStoreError ? error : storageError(error);
          if (demoError.code === "storage-unavailable") persistenceMode = "session";
          publish(demoError);
          throw demoError;
        }
        return;
      }
      commit(resetData);
    },
  };
}
