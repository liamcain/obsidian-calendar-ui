import type { Moment } from "moment";

export interface IDot {
  className: string;
  color: string;
  isFilled: boolean;
}

export interface IDayMetadata {
  name: string;
  value: number;
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

export interface IWeek {
  days: Moment[];
  weekNum: number;
}

export type IMonth = IWeek[];
