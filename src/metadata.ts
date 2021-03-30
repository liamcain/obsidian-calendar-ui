import type { Moment } from "moment";
import type { IGranularity } from "obsidian-daily-notes-interface";

import type {
  ICalendarSource,
  IDayMetadata,
  IEvaluatedMetadata,
  ISourceSettings,
} from "./types";

export async function getEvaluatedMetadata(
  granularity: IGranularity,
  sources: ICalendarSource[],
  getSourceSettings: (sourceId: string) => ISourceSettings,
  date: Moment,
  ..._args: unknown[]
): Promise<IDayMetadata[]> {
  const metadata = [];
  for (const source of sources) {
    let getMetadata: (date: Moment) => Promise<IEvaluatedMetadata>;
    if (granularity === "day") {
      getMetadata = source.getDailyMetadata;
    } else if (granularity === "week") {
      getMetadata = source.getWeeklyMetadata;
    } else if (granularity === "month") {
      getMetadata = source.getMonthlyMetadata;
    }

    if (!getMetadata) {
      // ignore sources that dont apply to daily notes
      continue;
    }

    const evaluatedMetadata = (await source.getDailyMetadata?.(date)) || {};
    const sourceSettings = getSourceSettings(source.id);

    metadata.push({
      ...evaluatedMetadata,
      ...source,
      ...sourceSettings,
    });
  }
  return metadata;
}
