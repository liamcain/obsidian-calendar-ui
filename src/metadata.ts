// import type { Moment } from "moment";

// import type { ICalendarSource, IDayMetadata, IWeekMetadata } from "./types";
import type { IDayMetadata } from "./types";

// export async function _getDailyMetadata(
//   sources: ICalendarSource[],
//   date: Moment
// ): Promise<IDayMetadata> {
//   const meta = {
//     dots: [],
//     classes: [],
//     dataAttributes: [],
//   };
//   const metas = await Promise.all(
//     sources.map((source) => source.getDailyMetadata(date))
//   );
//   return metas.reduce((acc, meta) => {
//     return {
//       classes: [...acc.classes, ...meta.classes],
//       dataAttributes: [...acc.dataAttributes, ...meta.dataAttributes],
//       dots: [...acc.dots, ...meta.dots],
//     };
//   }, meta);
// }

// export async function _getWeeklyMetadata(
//   sources: ICalendarSource[],
//   date: Moment
// ): Promise<IWeekMetadata> {
//   const meta = {
//     dots: [],
//     classes: [],
//     dataAttributes: [],
//   };
//   const metas = await Promise.all(
//     sources.map((source) => source.getWeeklyMetadata(date))
//   );
//   return metas.reduce((acc, meta) => {
//     return {
//       classes: [...acc.classes, ...meta.classes],
//       dataAttributes: [...acc.dataAttributes, ...meta.dataAttributes],
//       dots: [...acc.dots, ...meta.dots],
//     };
//   }, meta);
// }

export async function metadataReducer(
  promisedMetadata: Promise<IDayMetadata>[]
): Promise<IDayMetadata> {
  const meta = {
    dots: [],
    classes: [],
    dataAttributes: [],
  };
  const metas = await Promise.all(promisedMetadata);
  return metas.reduce((acc, meta) => {
    return {
      classes: [...acc.classes, ...meta.classes],
      dataAttributes: [...acc.dataAttributes, ...meta.dataAttributes],
      dots: [...acc.dots, ...meta.dots],
    };
  }, meta);
}
