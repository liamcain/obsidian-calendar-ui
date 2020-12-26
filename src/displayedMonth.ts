import type { Moment } from "moment";
import { writable, Readable } from "svelte/store";

export interface DisplayMonthStore extends Readable<Moment> {
  reset: () => void;
  increment: () => void;
  decrement: () => void;
}

export function createDisplayedMonthStore(): DisplayMonthStore {
  const store = writable<Moment>(window.moment());
  return {
    reset: () => store.set(window.moment()),
    increment: () => store.update((month) => month.clone().add(1, "months")),
    decrement: () =>
      store.update((month) => month.clone().subtract(1, "months")),
    ...store,
  };
}
