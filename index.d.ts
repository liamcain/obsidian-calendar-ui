import type { Moment } from "moment";
import type { TFile } from 'obsidian';
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
  getDailyMetadata(file: TFile | null, date: Moment): Promise<IDayMetadata>;
  getWeeklyMetadata(file: TFile | null, date: Moment): Promise<IWeekMetadata>;
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
  dailyNotes?: Record<string, TFile>;
  activeFile?: TFile | null;
  sources?: ICalendarSource[];

  // Override-able local state
  today?: Moment;
  displayedMonth?: Moment;
}> {}
