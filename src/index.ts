import Calendar from "./components/Calendar.svelte";
import type { ICalendarSource, IDot, IDayMetadata } from "./types";
import type { App } from "obsidian";
import type moment from "moment";

declare global {
  interface Window {
    app: App;
    moment: typeof moment;
  }
}

export { Calendar };
export type { ICalendarSource, IDot, IDayMetadata };
