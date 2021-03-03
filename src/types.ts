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
  minDots: number;
  maxDots: number;
  valueToDotRadio: number;
  color: string;
  isShowcased?: boolean;
}

export interface ICalendarSource {
  getDailyMetadata?: (date: Moment) => Promise<IDayMetadata>;
  getWeeklyMetadata?: (date: Moment) => Promise<IDayMetadata>;
  getMonthlyMetadata?: (date: Moment) => Promise<IDayMetadata>;
}

export interface IWeek {
  days: Moment[];
  weekNum: number;
}

export type IMonth = IWeek[];
