<script lang="ts">
  import type { Moment } from "moment";

  import Day from "./Day.svelte";
  import Nav from "./Nav.svelte";
  import WeekNum from "./WeekNum.svelte";
  import { getDailyMetadata, getWeeklyMetadata } from "../metadata";
  import type { ICalendarSource, IMonth } from "../types";
  import { getDaysOfWeek, getMonth, isWeekend } from "../utils";

  // Settings
  export let showWeekNums: boolean = false;

  // Event Handlers
  export let onHoverDay: (
    date: Moment,
    targetEl: EventTarget,
    isMetaPressed: boolean
  ) => boolean;
  export let onHoverWeek: (
    date: Moment,
    targetEl: EventTarget,
    isMetaPressed: boolean
  ) => boolean;
  export let onClickDay: (date: Moment, isMetaPressed: boolean) => boolean;
  export let onClickWeek: (date: Moment, isMetaPressed: boolean) => boolean;

  // External sources (All optional)
  export let sources: ICalendarSource[] = [];
  export let selectedId: string;

  // Override-able local state
  export let today: Moment = window.moment();
  export let displayedMonth = today;

  let month: IMonth;
  let daysOfWeek: string[];

  $: month = getMonth(displayedMonth);
  $: daysOfWeek = getDaysOfWeek(today);

  // Exports
  export function incrementDisplayedMonth() {
    displayedMonth = displayedMonth.clone().add(1, "month");
  }

  export function decrementDisplayedMonth() {
    displayedMonth = displayedMonth.clone().subtract(1, "month");
  }

  export function resetDisplayedMonth() {
    displayedMonth = today.clone();
  }
</script>

<svelte:options immutable />
<div id="calendar-container" class="container">
  <Nav
    today="{today}"
    displayedMonth="{displayedMonth}"
    incrementDisplayedMonth="{incrementDisplayedMonth}"
    decrementDisplayedMonth="{decrementDisplayedMonth}"
    resetDisplayedMonth="{resetDisplayedMonth}"
  />
  <table class="calendar">
    <colgroup>
      {#if showWeekNums}
        <col />
      {/if}
      {#each month[1].days as date}
        <col class:weekend="{isWeekend(date)}" />
      {/each}
    </colgroup>
    <thead>
      <tr>
        {#if showWeekNums}
          <th>W</th>
        {/if}
        {#each daysOfWeek as dayOfWeek}
          <th>{dayOfWeek}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      <!-- update calendar on clock ticks -->
      {#key today}
        {#each month as week}
          <tr>
            {#if showWeekNums}
              <WeekNum
                {...week}
                metadata="{getWeeklyMetadata(sources, week.days[0])}"
                onClick="{onClickWeek}"
                onHover="{onHoverWeek}"
                selectedId="{selectedId}"
              />
            {/if}
            {#each week.days as day (day.format())}
              <Day
                date="{day}"
                today="{today}"
                displayedMonth="{displayedMonth}"
                onClick="{onClickDay}"
                onHover="{onHoverDay}"
                metadata="{getDailyMetadata(sources, day)}"
                selectedId="{selectedId}"
              />
            {/each}
          </tr>
        {/each}
      {/key}
    </tbody>
  </table>
</div>

<style>
  .container {
    --color-background-heading: transparent;
    --color-background-day: transparent;
    --color-background-weeknum: transparent;
    --color-background-weekend: transparent;

    --color-dot: var(--text-muted);
    --color-arrow: var(--text-muted);
    --color-button: var(--text-muted);

    --color-text-title: var(--text-normal);
    --color-text-heading: var(--text-muted);
    --color-text-day: var(--text-normal);
    --color-text-today: var(--interactive-accent);
    --color-text-weeknum: var(--text-muted);
  }

  .container {
    padding: 0 8px;
  }

  th {
    text-align: center;
  }

  .weekend {
    background-color: var(--color-background-weekend);
  }

  .calendar {
    border-collapse: collapse;
    width: 100%;
  }

  th {
    background-color: var(--color-background-heading);
    color: var(--color-text-heading);
    font-size: 0.6em;
    letter-spacing: 1px;
    padding: 4px;
    text-transform: uppercase;
  }
</style>