import Calendar from "./Calendar.svelte";
import { createMetadataCache } from "./metadata";
import {
  CalendarSource,
  IMetadataStore,
  IDot,
  IDayMetadata,
  IWeekMetadata,
  IWritableMetadata,
} from "./types";

export { createMetadataCache, Calendar, CalendarSource };
export type {
  IDot,
  IDayMetadata,
  IMetadataStore,
  IWeekMetadata,
  IWritableMetadata,
};
