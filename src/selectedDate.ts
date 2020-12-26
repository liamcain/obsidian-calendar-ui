import type { Moment } from "moment";
import { writable, Writable } from "svelte/store";

export function createSelectedDate(): Writable<Moment> {
  const store = writable<Moment>(null);
  return store;
}
