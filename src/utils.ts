import type { Moment } from "moment";

import type {
  Granularity,
  ICalendarSource,
  IDot,
  IEvaluatedMetadata,
  IMonth,
  ISourceSettings,
  IWeek,
} from "./types";

function isMacOS() {
  return navigator.appVersion.indexOf("Mac") != -1;
}

export function isMetaPressed(e: MouseEvent): boolean {
  return isMacOS() ? e.metaKey : e.ctrlKey;
}

export function getDaysOfWeek(..._args: unknown[]): string[] {
  return window.moment.weekdaysShort(true);
}

export function isWeekend(date: Moment): boolean {
  return date.isoWeekday() === 6 || date.isoWeekday() === 7;
}

export function getStartOfWeek(days: Moment[]): Moment {
  return days[0].weekday(0);
}

export function isoWeek(date: Moment): number {
  return Math.trunc((date.dayOfYear() + 10) / 7);
}

/**
 * Generate a 2D array of daily information to power
 * the calendar view.
 */
export function getMonth(
  displayedMonth: Moment,
  isISO: boolean,
  ..._args: unknown[]
): IMonth {
  const locale = window.moment().locale();
  const month = [];
  let week: IWeek;

  const startOfMonth = displayedMonth.clone().locale(locale).date(1);
  const startOffset = startOfMonth.weekday();
  let date: Moment = startOfMonth.clone().subtract(startOffset, "day");

  for (let _day = 0; _day < 42; _day++) {
    if (_day % 7 === 0) {
      week = {
        days: [],
        weekNum: isISO ? isoWeek(date) : date.week(),
      };
      month.push(week);
    }

    week.days.push(date);
    date = date.clone().add(1, "day");
  }

  return month;
}

export const emptyDot = (): IDot => ({ isFilled: false });
export const emptyDots = (numDots: number): IDot[] =>
  numDots ? [...Array(numDots).keys()].map(emptyDot) : [];

export const filledDot = (): IDot => ({ isFilled: true });
export const filledDots = (numDots: number): IDot[] =>
  numDots ? [...Array(numDots).keys()].map(filledDot) : [];

export async function evaluateMetadataFromSources(
  sources: ICalendarSource[],
  granularity: Granularity,
  date: Moment,
  ..._args: any[]
): Promise<IEvaluatedMetadata> {
  // TODO this currently makes no sense
  // XXX: fix this
  const metadata: IEvaluatedMetadata = {
    dots: [],
    value: "--",
  };
  for (const source of sources) {
    const sourceMeta = await source.getMetadata(granularity, date);
    metadata.dots.push(...sourceMeta.dots);
  }
  return metadata;
}
