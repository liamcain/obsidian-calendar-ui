import type { Moment } from "moment";
import { SvelteComponentTyped } from "svelte";

export interface IDot {
  color: string;
  isFilled: boolean;
}

export interface IDayMetadata {
  classes?: string[];
  dataAttributes?: string[];
  dots: IDot[];
}

export interface IWeekMetadata {
  classes?: string[];
  dataAttributes?: string[];
  dots: IDot[];
}

export interface ICalendarSource {
  getDailyMetadata?: (date: Moment) => Promise<IDayMetadata>;
  getWeeklyMetadata?: (date: Moment) => Promise<IWeekMetadata>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getDailyCacheKey: (args: any[], callArgs: any[]) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getWeeklyCacheKey: (args: any[], callArgs: any[]) => boolean;
}

export class Calendar extends SvelteComponentTyped<{
  // Settings
  showWeekNums: boolean;

  // Event Handlers
  onHoverDay: (date: Moment, targetEl: EventTarget) => void;
  onHoverWeek: (date: Moment, targetEl: EventTarget) => void;
  onClickDay: (date: Moment, isMetaPressed: boolean) => void;
  onClickWeek: (date: Moment, isMetaPressed: boolean) => void;

  // External sources
  selectedId?: string | null;
  sources?: ICalendarSource[];

  // Override-able local state
  today?: Moment;
  displayedMonth?: Moment;
}> {}
