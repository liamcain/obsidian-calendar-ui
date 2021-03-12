import type { Locale, Moment } from "moment";
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
  color: string;
  isFilled: boolean;
}

export interface IDayMetadata {
  name: string;
  value: number | string;
  goal?: number;

  // appearance
  color: string;
  toDots?: (value: number, goal?: number) => IDot[];
  isShowcased?: boolean;
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

  getDailyMetadata?: (date: Moment) => Promise<IDayMetadata>;
  getWeeklyMetadata?: (date: Moment) => Promise<IDayMetadata>;
  getMonthlyMetadata?: (date: Moment) => Promise<IDayMetadata>;
  registerSettings?: (
    containerEl: HTMLElement,
    settings: ISourceSettings,
    saveSettings: (settings: Partial<ISourceSettings>) => void
  ) => void;
}

export interface IRealizedSource {
  id: string;
  name: string;
  description?: string;

  color: string;
  display: ISourceDisplayOption;
  order: number;
}

export class Calendar extends SvelteComponentTyped<{
  // Settings
  showWeekNums: boolean;
  localeData?: Locale;

  // Event Handlers
  onHoverDay?: (date: Moment, targetEl: EventTarget) => void;
  onHoverWeek?: (date: Moment, targetEl: EventTarget) => void;
  onHoverMonth?: (date: Moment, targetEl: EventTarget) => void;
  onClickDay?: (date: Moment, isMetaPressed: boolean) => void;
  onClickWeek?: (date: Moment, isMetaPressed: boolean) => void;
  onClickMonth?: (date: Moment, isMetaPressed: boolean) => void;
  onContextMenuDay?: (date: Moment, event: MouseEvent) => boolean;
  onContextMenuWeek?: (date: Moment, event: MouseEvent) => boolean;
  onContextMenuMonth?: (date: Moment, event: MouseEvent) => boolean;

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
