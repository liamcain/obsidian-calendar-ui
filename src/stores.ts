import type { Moment } from "moment";
import { writable } from "svelte/store";

function createDisplayedMonthStore() {
  const store = writable<Moment>(window.moment());
  return {
    reset: () => store.set(window.moment()),
    increment: () => store.update((month) => month.clone().add(1, "months")),
    decrement: () =>
      store.update((month) => month.clone().subtract(1, "months")),
    ...store,
  };
}

export const displayedMonth = createDisplayedMonthStore();
