<script lang="ts">
  import type { Moment } from "moment";
  import { derived, Readable } from "svelte/store";

  import Arrow from "./Arrow.svelte";
  import Day from "./Day.svelte";
  import WeekNum from "./WeekNum.svelte";
  import { displayedMonth, metadata } from "./stores";
  import {
    IMonth,
    getDaysOfWeek,
    getMonth,
    getStartOfWeek,
    isWeekend,
  } from "./utils";

  export let today: Moment = window.moment();
  export let showWeekNums: boolean = false;

  export let onHoverDay: (date: Moment, targetEl: EventTarget) => void;
  export let onHoverWeek: (date: Moment, targetEl: EventTarget) => void;
  export let onClickDay: (date: Moment, isMetaPressed: boolean) => void;
  export let onClickWeek: (date: Moment, isMetaPressed: boolean) => void;

  export let localeData: any;
  export let dependencies: [Readable<any>, ...Array<Readable<any>>];

  const dependencyStore = derived(dependencies, (values) => values);

  let month: IMonth;
  let daysOfWeek: string[];

  // Get the word 'Today' but localized to the current language
  const todayDisplayStr = today.calendar().split(/\d|\s/)[0];

  $: month = getMonth($displayedMonth, localeData);
  $: daysOfWeek = getDaysOfWeek(localeData);
</script>

<svelte:options immutable />
<div id="calendar-container" class="container">
  <div class="nav">
    <h3 class="title" on:click="{displayedMonth.reset}">
      <span class="month">{$displayedMonth.format('MMM')}</span>
      <span class="year">{$displayedMonth.format('YYYY')}</span>
    </h3>
    <div class="right-nav">
      <Arrow
        direction="left"
        onClick="{displayedMonth.decrement}"
        tooltip="Previous Month"
      />
      <div class="reset-button" on:click="{displayedMonth.reset}">
        {todayDisplayStr}
      </div>
      <Arrow
        direction="right"
        onClick="{displayedMonth.increment}"
        tooltip="Next Month"
      />
    </div>
  </div>
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
      {#each month as week}
        <tr>
          {#if showWeekNums}
            <WeekNum
              {...week}
              onClick="{onClickWeek}"
              onHover="{onHoverWeek}"
              metadata="{metadata.getWeek(getStartOfWeek(week.days), $dependencyStore)}"
            />
          {/if}
          {#each week.days as date (date.format())}
            <Day
              today="{today}"
              date="{date}"
              onClick="{onClickDay}"
              onHover="{onHoverDay}"
              metadata="{metadata.getDay(date, $dependencyStore)}"
            />
          {/each}
        </tr>
      {/each}
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

  .nav {
    align-items: center;
    display: flex;
    margin: 0.6em 0 1em;
    padding: 0 8px;
    width: 100%;
  }

  .title {
    color: var(--color-text-title);
    font-size: 1.5em;
    margin: 0;
  }

  .month {
    font-weight: 500;
    text-transform: capitalize;
  }

  .year {
    color: var(--interactive-accent);
  }

  .right-nav {
    display: flex;
    justify-content: center;
    margin-left: auto;
  }

  .reset-button {
    border-radius: 4px;
    color: var(--text-muted);
    font-size: 0.7em;
    font-weight: 600;
    letter-spacing: 1px;
    margin: 0 4px;
    padding: 0px 4px;
    text-transform: uppercase;
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
    padding: 4px 8px;
    text-transform: uppercase;
  }
</style>
