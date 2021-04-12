import type { Locale, Moment } from "moment";
import type { App, TFile } from "obsidian";
import type { IGranularity } from "obsidian-daily-notes-interface";
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
  value: number | string;
  goal?: number;
  dots: IDot[];
}

export type ISourceDisplayOption = "calendar-and-menu" | "menu" | "none";

export interface ISourceSettings {
  color: string;
  display: ISourceDisplayOption;
  order: number;
}

export interface IDayMetadata
  extends ICalendarSource,
    ISourceSettings,
    IEvaluatedMetadata {}

export interface ICalendarSource {
  id: string;
  name: string;
  description?: string;

  getMetadata?: (
    granularity: IGranularity,
    date: Moment,
    file: TFile
  ) => Promise<IEvaluatedMetadata>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultSettings: any;
  registerSettings?: (
    containerEl: HTMLElement,
    settings: ISourceSettings,
    saveSettings: (settings: Partial<ISourceSettings>) => void
  ) => void;
}

export type IHTMLAttributes = Record<string, string | number | boolean>;

export interface IEvaluatedMetadata {
  value: number;
  goal?: number;
  dots: IDot[];
  attrs?: IHTMLAttributes;
}

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
  showWeekNums: boolean;
  localeData?: Locale;
  eventHandlers: CallableFunction[];

  // External sources
  selectedId?: string | null;
  sources?: ICalendarSource[];
  getSourceSettings: (sourceId: string) => ISourceSettings;

  // Override-able local state
  today?: Moment;
  displayedMonth?: Moment;
}> {}

export function configureGlobalMomentLocale(
  localeOverride: ILocaleOverride,
  weekStart: IWeekStartOption
): string;
