import type { Moment } from "moment";

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

export interface IWeek {
  days: Moment[];
  weekNum: number;
}

export type IMonth = IWeek[];
