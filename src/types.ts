import type { Moment } from "moment";

export interface IDot {
  isFilled: boolean;
}

export interface IWeek {
  days: Moment[];
  weekNum: number;
}

export type IMonth = IWeek[];

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
