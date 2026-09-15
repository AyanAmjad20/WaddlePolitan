export type AnimalType = "goose" | "pigeon" | "other";

export type SightingAuthor = {
  id: string;
  displayName: string;
};

/**
 * A student-reported observation. Coordinates use WGS 84 latitude/longitude.
 * `observedAt` is when the animal was seen; `createdAt` is when the report was saved.
 */
export type Sighting = {
  id: string;
  author: SightingAuthor;
  animalType: AnimalType;
  count: number;
  latitude: number;
  longitude: number;
  locationLabel: string;
  notes: string;
  photos: string[];
  observedAt: string;
  createdAt: string;
};

/** Input for a new sighting in the local prototype. */
export type SightingDraft = {
  animalType: AnimalType;
  count: number;
  latitude: number;
  longitude: number;
  locationLabel?: string;
  notes?: string;
  photos?: string[];
  /** Keep this value when retrying a submission so one report is created. */
  submissionId?: string;
  /** Allows a report to describe an earlier observation without looking newly seen. */
  observedAt?: string;
};

export type Confirmation = {
  id: string;
  sightingId: string;
  userId: string;
  createdAt: string;
};

export type DemoProfile = SightingAuthor & {
  bio: string;
};

export type CampusLocation = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  /** These coordinates are illustrative prototype pins, not verified reporting bounds. */
  isPrototypeCoordinate: true;
};
