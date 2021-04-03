import type { Moment } from "moment";
import type { TFile } from "obsidian";

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

  getMetadata?: (date: Moment, file: TFile) => Promise<IEvaluatedMetadata>;

  defaultSettings: Record<string, string | number>;
  registerSettings?: (
    containerEl: HTMLElement,
    settings: ISourceSettings,
    saveSettings: (settings: Partial<ISourceSettings>) => void
  ) => void;
}
