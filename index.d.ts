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
  isFilled: boolean;
}

export interface IEvaluatedMetadata {
  value: number;
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

  getDailyMetadata?: (date: Moment) => Promise<IEvaluatedMetadata>;
  getWeeklyMetadata?: (date: Moment) => Promise<IEvaluatedMetadata>;
  getMonthlyMetadata?: (date: Moment) => Promise<IEvaluatedMetadata>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultSettings: any;
  registerSettings?: (
    containerEl: HTMLElement,
    settings: ISourceSettings,
    saveSettings: (settings: Partial<ISourceSettings>) => void
  ) => void;
}

export interface IEvaluatedMetadata {
  value: number;
  goal?: number;
  dots: IDot[];
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
  getSourceSettings: (sourceId: string) => ISourceSettings;

  // Override-able local state
  today?: Moment;
  displayedMonth?: Moment;
}> {}

export function configureGlobalMomentLocale(
  localeOverride: ILocaleOverride,
  weekStart: IWeekStartOption
): string;
