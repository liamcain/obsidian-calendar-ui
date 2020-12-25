import type { Moment } from "moment";
import type { Writable } from "svelte/store";

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

export interface IWritableMetadata extends Writable<IMetadataStore> {
  addSource: (source: CalendarSource) => void;
  setDay: (date: Moment, metadata: IDayMetadata) => void;
  setWeek: (date: Moment, metadata: IDayMetadata) => void;
  reset: () => void;
}

export interface IDayWithMeta {
  day: Moment;
  metadata: IDayMetadata;
}

export interface IWeek {
  days: Moment[];
  weekNum: number;
}

interface IWeekWithMeta {
  days: IDayWithMeta[];
  metadata: IWeekMetadata;
  weekNum: number;
}

export type IMonth = IWeek[];
export type IMonthWithMeta = IWeekWithMeta[];
