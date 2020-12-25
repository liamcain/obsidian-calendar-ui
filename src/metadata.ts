import type { Moment } from "moment";
import { getDateUID } from "obsidian-daily-notes-interface";
import { writable } from "svelte/store";

import type {
  CalendarSource,
  IDayMetadata,
  IWeekMetadata,
  IWritableMetadata,
  IMetadataStore,
} from "./types";

export function createMetadataCache(source: CalendarSource): IWritableMetadata {
  const store = writable<IMetadataStore>({
    dailyCache: {},
    weeklyCache: {},
    source,
  });

  const addSource = (source: CalendarSource): void => {
    store.update((cache: IMetadataStore) => ({
      ...cache,
      source,
    }));
  };

  const setDay = (date: Moment, metadata: IDayMetadata): void => {
    const dateKey = getDateUID(date);
    store.update((cache: IMetadataStore) => ({
      ...cache,
      dailyCache: {
        ...cache.dailyCache,
        [dateKey]: metadata,
      },
    }));
  };

  const setWeek = (date: Moment, metadata: IWeekMetadata): void => {
    const dateKey = getDateUID(date);
    store.update((cache: IMetadataStore) => ({
      ...cache,
      weeklyCache: {
        ...cache.dailyCache,
        [dateKey]: metadata,
      },
    }));
  };

  const reset = (): void => {
    store.update((cache: IMetadataStore) => ({
      ...cache,
      dailyCache: {},
      weeklyCache: {},
    }));
  };

  return {
    ...store,
    addSource,
    setDay,
    setWeek,
    reset,
  };
}

export const getDay = (
  metadata: IMetadataStore,
  date: Moment
): IDayMetadata => {
  const dateStr = getDateUID(date);
  let value = metadata.dailyCache[dateStr];
  if (value) {
    return value;
  }

  // mutate object to avoid a rerender
  value = metadata.source.getDailyMetadata(date);
  metadata.dailyCache[dateStr] = value;

  return value;
};

export const getWeek = (
  metadata: IMetadataStore,
  date: Moment
): IDayMetadata => {
  const dateStr = getDateUID(date);
  let value = metadata.weeklyCache[dateStr];
  if (value) {
    return value;
  }

  // mutate object to avoid a rerender
  value = metadata.source.getWeeklyMetadata(date);
  metadata.weeklyCache[dateStr] = value;

  return value;
};
