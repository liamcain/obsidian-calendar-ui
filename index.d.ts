import type { Moment } from "moment";
import { SvelteComponentTyped } from "svelte";
import { Readable, Writable } from "svelte/store";

declare module "obsidian-calendar-ui";

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

type Store<T> = Readable<T> | Writable<T>;

export abstract class CalendarSource {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract getDailyMetadata(date: Moment, ...args: any[]): IDayMetadata;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract getWeeklyMetadata(date: Moment, ...args: any[]): IDayMetadata;
}

export class MetadataCache {
  public addSource(source: CalendarSource): void;
  public setDay(date: Moment, metadata: IDayMetadata): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getDay(date: Moment, ..._args: any[]): IDayMetadata;
  public setWeek(date: Moment, metadata: IDayMetadata): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getWeek(date: Moment, ..._args: any[]): IDayMetadata;
  public reset(): void;
}

export default class Calendar extends SvelteComponentTyped<{
  metadata: MetadataCache;
  showWeekNums: boolean;

  onHoverDay: (date: Moment, targetEl: EventTarget) => void;
  onHoverWeek: (date: Moment, targetEl: EventTarget) => void;
  onClickDay: (date: Moment, isMetaPressed: boolean) => void;
  onClickWeek: (date: Moment, isMetaPressed: boolean) => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  localeData?: any;
  today?: Moment;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dependencies?: [Store<any>, ...Array<Store<any>>];
}> {}
