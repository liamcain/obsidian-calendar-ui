import type { Moment } from "moment";
import { getDateUID } from "obsidian-daily-notes-interface";
import { writable, Writable } from "svelte/store";

export interface IDot {
  color: string;
  isFilled: boolean;
}

export interface IDayMetadata {
  classes?: string[];
  dataAttributes?: string[];
  dots: Promise<IDot[]>;
}

export interface IWeekMetadata {
  classes?: string[];
  dataAttributes?: string[];
  dots: Promise<IDot[]>;
}

export abstract class CalendarSource {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract getDailyMetadata(date: Moment, ...args: any[]): IDayMetadata;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract getWeeklyMetadata(date: Moment, ...args: any[]): IDayMetadata;
}

export interface IMetadataStore {
  dailyCache: Record<string, IDayMetadata>;
  weeklyCache: Record<string, IWeekMetadata>;
  source: CalendarSource;
}

interface IWritableMetadata extends Writable<IMetadataStore> {
  addSource: (source: CalendarSource) => void;
  setDay: (date: Moment, metadata: IDayMetadata) => void;
  setWeek: (date: Moment, metadata: IDayMetadata) => void;
  reset: () => void;
}

export function createMetadataCache(): IWritableMetadata {
  const store = writable<IMetadataStore>({
    dailyCache: {},
    weeklyCache: {},
    source: null,
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
