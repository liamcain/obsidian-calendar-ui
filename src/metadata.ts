import memoize from 'memoizee';
import type { TFile } from 'obsidian';
import type { Moment } from "moment";

import type { ICalendarSource, IDayMetadata, IWeekMetadata } from './types';

export async function _getDailyMetadata(sources: ICalendarSource[], file: TFile, date: Moment): Promise<IDayMetadata> {
  const meta = {
      dots: [],
      classes: [],
      dataAttributes: [],
  }
    const metas = await Promise.all(sources.map(source => source.getDailyMetadata(file, date)))
    return metas.reduce((acc, meta) => {
      return {
        ...acc,
        dots: [...acc.dots, ...meta.dots],
      };
    }, meta);
}

export async function _getWeeklyMetadata(sources: ICalendarSource[], file: TFile, date: Moment): Promise<IWeekMetadata> {
  const meta = {
      dots: [],
      classes: [],
      dataAttributes: [],
  }
    const metas = await Promise.all(sources.map(source => source.getWeeklyMetadata(file, date)))
    return metas.reduce((acc, meta) => {
      return {
        ...acc,
        dots: [...acc.dots, ...meta.dots],
      };
    }, meta);
}

export const getDailyMetadata = memoize(_getDailyMetadata);
export const getWeeklyMetadata = memoize(_getWeeklyMetadata);