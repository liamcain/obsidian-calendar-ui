import type { Moment } from "moment";
import { writable } from "svelte/store";
import { getDateUID } from "obsidian-daily-notes-interface";

import type {
  CalendarSource,
  IDayMetadata,
  IWeekMetadata,
} from "./CalendarSource";

export class MetadataCache {
  private dailyCache: Record<string, IDayMetadata>;
  private weeklyCache: Record<string, IWeekMetadata>;
  private source: CalendarSource;

  constructor() {
    this.dailyCache = {};
    this.weeklyCache = {};
  }

  addSource(source: CalendarSource): void {
    this.source = source;
  }

  setDay(date: Moment, metadata: IDayMetadata): void {
    const key = getDateUID(date);
    this.weeklyCache = Object.assign(
      {},
      {
        [key]: metadata,
      }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getDay(date: Moment, ..._args: any[]): IDayMetadata {
    const dateStr = getDateUID(date);
    let value = this.dailyCache[dateStr];
    if (value) {
      return value;
    }
    value = this.source.getDailyMetadata(date);
    this.setDay(date, value);
    return value;
  }

  setWeek(date: Moment, metadata: IDayMetadata): void {
    const key = getDateUID(date);
    this.weeklyCache = Object.assign(
      {},
      {
        [key]: metadata,
      }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getWeek(date: Moment, ..._args: any[]): IDayMetadata {
    const dateStr = getDateUID(date);
    let value = this.weeklyCache[dateStr];
    if (value) {
      return value;
    }
    value = this.source.getWeeklyMetadata(date);
    this.setWeek(date, value);
    return value;
  }

  reset(): void {
    this.dailyCache = {};
    this.weeklyCache = {};
  }
}

function createDisplayedMonthStore() {
  const store = writable<Moment>(null);
  return {
    reset: () => store.set(window.moment()),
    increment: () => store.update((month) => month.clone().add(1, "months")),
    decrement: () =>
      store.update((month) => month.clone().subtract(1, "months")),
    ...store,
  };
}

export const displayedMonth = createDisplayedMonthStore();
