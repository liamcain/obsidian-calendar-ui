import type { Moment } from "moment";
import { SvelteComponentTyped } from "svelte";
import { Readable, Writable } from "svelte/store";

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

type Store<T> = Readable<T> | Writable<T>;

export abstract class CalendarSource {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract getDailyMetadata(date: Moment, ...args: any[]): IDayMetadata;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract getWeeklyMetadata(date: Moment, ...args: any[]): IDayMetadata;
}

export interface IWritableMetadata extends Writable<IMetadataStore> {
  addSource: (source: CalendarSource) => void;
  setDay: (date: Moment, metadata: IDayMetadata) => void;
  setWeek: (date: Moment, metadata: IDayMetadata) => void;
  reset: () => void;
}

export function createMetadataCache(source: CalendarSource): IWritableMetadata;
export class Calendar extends SvelteComponentTyped<{
  showWeekNums: boolean;

  onHoverDay: (date: Moment, targetEl: EventTarget) => void;
  onHoverWeek: (date: Moment, targetEl: EventTarget) => void;
  onClickDay: (date: Moment, isMetaPressed: boolean) => void;
  onClickWeek: (date: Moment, isMetaPressed: boolean) => void;

  metadata: IWritableMetadata;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  localeData?: any;
  today?: Moment;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dependencies?: [Store<any>, ...Array<Store<any>>];
}> {}
