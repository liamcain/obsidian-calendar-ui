import type { Moment } from "moment";
import * as os from "os";

import type { IMonth, IWeek } from "./types";

function isMacOS() {
  return os.platform() === "darwin";
}

export function isMetaPressed(e: MouseEvent): boolean {
  return isMacOS() ? e.metaKey : e.ctrlKey;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDaysOfWeek(..._args: any[]): string[] {
  return window.moment.weekdaysShort(true);
}

export function isWeekend(date: Moment): boolean {
  return date.isoWeekday() === 6 || date.isoWeekday() === 7;
}

export function getStartOfWeek(days: Moment[]): Moment {
  return days[0].weekday(0);
}

/**
 * Generate a 2D array of daily information to power
 * the calendar view.
 */
export function getMonth(displayedMonth: Moment): IMonth {
  const month = [];
  let week: IWeek;

  const startOfMonth = displayedMonth.clone().date(1);
  const startOffset = startOfMonth.weekday();
  let date: Moment = startOfMonth.clone().subtract(startOffset, "days");

  for (let _day = 0; _day < 42; _day++) {
    if (_day % 7 === 0) {
      week = {
        days: [],
        weekNum: date.week(),
      };
      month.push(week);
    }

    week.days.push(date);
    date = date.clone().add(1, "days");
  }

  return month;
}

export function getDateUID(date: Moment, granularity: "day" | "week"): string {
  return `${granularity}-${date.clone().startOf(granularity).format()}`;
}
