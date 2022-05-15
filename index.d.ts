import type { Locale, Moment } from "moment";
import type { App, TFile } from "obsidian";
import { SvelteComponentTyped } from "svelte";

export type ILocaleOverride = "system-default" | string;
export type IWeekStartOption =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "locale";

export interface IDot {
  isFilled: boolean;
}

export interface IEvaluatedMetadata {
  attrs?: IHTMLAttributes;
  dots: IDot[];
  goal?: number;
  value: number | string;
}

export type ISourceDisplayOption = "calendar-and-menu" | "menu" | "none";

export interface ISourceSettings {
  color: string;
  display: ISourceDisplayOption;
  order: number;
}

export interface ICalendarSource {
  id: string;
  name: string;
  description?: string;

  getMetadata: (granularity: Granularity, date: Moment) => Promise<IEvaluatedMetadata>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultSettings: any;
  registerSettings?: (
    containerEl: HTMLElement,
    settings: ISourceSettings,
    saveSettings: (settings: Partial<ISourceSettings>) => void
  ) => void;
}

export type IHTMLAttributes = Record<string, string | number | boolean>;

export interface ISourceSettings {
  color: string;
  display: ISourceDisplayOption;
  order: number;
}

export interface IDayMetadata
  extends ICalendarSource,
    ISourceSettings,
    IEvaluatedMetadata {}

export class Calendar extends SvelteComponentTyped<{
  app: App;
  isISO: boolean;
  showWeekNums: boolean;
  localeData?: Locale;
  eventHandlers: CalendarEventHandlers;

  // External sources
  selectedId?: string | null;
  sources?: ICalendarSource[];

  // Override-able local state
  today?: Moment;
  displayedMonth?: Moment;
}> {}

export function configureGlobalMomentLocale(
  localeOverride: ILocaleOverride,
  weekStart: IWeekStartOption
): string;

export type Granularity =
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "year"; /*| "fiscal-year" */

export interface CalendarEventHandlers {
  onHover?: (periodicity: Granularity, date: Moment, event: PointerEvent) => boolean;
  onClick?: (granularity: Granularity, date: Moment, event: MouseEvent) => boolean;
  onContextMenu?: (granularity: Granularity, date: Moment, event: MouseEvent) => boolean;
}
