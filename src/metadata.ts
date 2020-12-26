import type { Moment } from "moment";
import { getDateUID } from "obsidian-daily-notes-interface";
import { Writable, writable } from "svelte/store";

import { createDisplayedMonthStore, DisplayMonthStore } from "./displayedMonth";
import { createSelectedDate, SelectedDate } from "./selectedDate";

import type {
  CalendarSource,
  IDayMetadata,
  IWeekMetadata,
  IWeek,
} from "./types";

export class MetadataCache {
  public displayedMonth: DisplayMonthStore;
  public selectedDate: SelectedDate;

  private dailyCache: Record<string, Writable<IDayMetadata>>;
  private weeklyCache: Record<string, Writable<IWeekMetadata>>;
  private source: CalendarSource;

  constructor(source: CalendarSource) {
    this.dailyCache = {};
    this.weeklyCache = {};
    this.source = source;

    this.displayedMonth = createDisplayedMonthStore();
    this.selectedDate = createSelectedDate();
  }

  public refreshDay(date: Moment): void {
    const key = getDateUID(date);
    const value = this.source.getDailyMetadata(date);

    if (this.dailyCache[key]) {
      this.dailyCache[key].set(value);
    } else {
      this.dailyCache[key] = writable<IDayMetadata>(value);
    }
  }

  public getDay(date: Moment): Writable<IDayMetadata> {
    const dateStr = getDateUID(date);
    return this.dailyCache[dateStr];
  }

  public refreshWeek(date: Moment): void {
    const key = getDateUID(date);
    const value = this.source.getWeeklyMetadata(date);

    if (this.weeklyCache[key]) {
      this.weeklyCache[key].set(value);
    } else {
      this.weeklyCache[key] = writable<IWeekMetadata>(value);
    }
  }

  public getWeek(week: IWeek): Writable<IWeekMetadata> {
    const dateStr = getDateUID(week.days[0]);
    return this.weeklyCache[dateStr];
  }
}
