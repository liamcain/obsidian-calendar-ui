import type { Moment } from "moment";
import type { TFile } from 'obsidian';

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
  getDailyMetadata(file: TFile | null, date: Moment): Promise<IDayMetadata>;
  getWeeklyMetadata(file: TFile | null, date: Moment): Promise<IWeekMetadata>;
}

export interface IWeek {
  days: Moment[];
  weekNum: number;
}

export type IMonth = IWeek[];
