import type { Moment } from "moment";

import type { ICalendarSource, IDayMetadata } from "./types";

export function clamp(
  num: number,
  lowerBound: number,
  upperBound: number
): number {
  return Math.min(Math.max(lowerBound, num), upperBound);
}

// export function getDots(metadata: IDayMetadata): IDot[] {
//   const { color, value, goal, toDots } = metadata;
//   const numDots = clamp(Math.round(value * valueToDotRadio), minDots, maxDots);

//   return [...Array(numDots).keys()].map(() => ({
//     className: "",
//     color,
//     isFilled: true,
//   }));
// }

async function metadataReducer(
  promisedMetadata: Promise<IDayMetadata>[]
): Promise<IDayMetadata[]> {
  // const meta = {
  //   dots: [],
  //   classes: [],
  //   dataAttributes: {},
  // };
  const metas = await Promise.all(promisedMetadata);
  return metas.filter((meta) => !!meta);
  // return metas
  //   .filter((meta) => !!meta)
  //   .reduce(
  //     (acc, meta) => ({
  //       classes: [...acc.classes, ...(meta.classes || [])],
  //       dataAttributes: Object.assign(acc.dataAttributes, meta.dataAttributes),
  //       dots: [...acc.dots, ...(meta.dots || [])],
  //     }),
  //     meta
  //   );
}

export function getDailyMetadata(
  sources: ICalendarSource[],
  date: Moment,
  ..._args: unknown[]
): Promise<IDayMetadata[]> {
  return metadataReducer(
    sources.map((source) => source.getDailyMetadata?.(date))
  );
}

export function getWeeklyMetadata(
  sources: ICalendarSource[],
  date: Moment,
  ..._args: unknown[]
): Promise<IDayMetadata[]> {
  return metadataReducer(
    sources.map((source) => source.getWeeklyMetadata?.(date))
  );
}

export function getMonthlyMetadata(
  sources: ICalendarSource[],
  date: Moment,
  ..._args: unknown[]
): Promise<IDayMetadata[]> {
  return metadataReducer(
    sources.map((source) => source.getMonthlyMetadata?.(date))
  );
}
