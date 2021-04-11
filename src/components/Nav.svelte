<script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import type { Moment } from "moment";

  import Arrow from "./Arrow.svelte";
  import type PeriodicNotesCache from "../fileStore";
  import { DISPLAYED_MONTH } from "../context";
  import Dot from "./Dot.svelte";
  import Month from "./Month.svelte";
  import type { ISourceSettings } from "../types";

  export let getSourceSettings: (sourceId: string) => ISourceSettings;
  export let fileCache: PeriodicNotesCache;
  export let today: Moment;
  export let eventHandlers: CallableFunction[];

  let displayedMonth = getContext<Writable<Moment>>(DISPLAYED_MONTH);

  function incrementDisplayedMonth() {
    displayedMonth.update((month) => month.clone().add(1, "month"));
  }

  function decrementDisplayedMonth() {
    displayedMonth.update((month) => month.clone().subtract(1, "month"));
  }

  function resetDisplayedMonth() {
    displayedMonth.set(today.clone());
  }

  let showingCurrentMonth: boolean;
  $: showingCurrentMonth = $displayedMonth.isSame(today, "month");
</script>

<div class="nav">
  <Month
    fileCache="{fileCache}"
    getSourceSettings="{getSourceSettings}"
    resetDisplayedMonth="{resetDisplayedMonth}"
    {...eventHandlers}
    on:hoverDay
    on:endHoverDay
  />
  <div class="right-nav">
    <Arrow
      direction="left"
      onClick="{decrementDisplayedMonth}"
      tooltip="Previous Month"
    />
    <div
      aria-label="{!showingCurrentMonth ? 'Reset to current month' : null}"
      class="reset-button"
      class:active="{!showingCurrentMonth}"
      on:click="{resetDisplayedMonth}"
    >
      <Dot isFilled />
    </div>
    <Arrow
      direction="right"
      onClick="{incrementDisplayedMonth}"
      tooltip="Next Month"
    />
  </div>
</div>

<style>
  .nav {
    align-items: baseline;
    display: flex;
    margin: 0.6em 0 1em;
    padding: 0 8px;
    width: 100%;
  }

  .right-nav {
    align-items: center;
    display: flex;
    justify-content: center;
    margin-left: auto;
  }

  .reset-button {
    align-items: center;
    color: var(--color-arrow);
    display: flex;
    opacity: 0.4;
    padding: 0.5em;
  }

  .reset-button.active {
    cursor: pointer;
    opacity: 1;
  }
</style>
