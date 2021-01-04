import Calendar from "./components/Calendar.svelte";
import type { ICalendarSource, IDot, IDayMetadata } from "./types";
import type { App } from "obsidian";
import type { Moment } from "moment";

declare global {
  interface Window {
    app: App;
    moment: () => Moment;
  }
}

export { Calendar };
export type { ICalendarSource, IDot, IDayMetadata };
