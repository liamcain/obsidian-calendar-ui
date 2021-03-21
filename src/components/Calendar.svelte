<svelte:options immutable />

<script lang="ts">
  import { debounce } from "obsidian";
  import type { Locale, Moment } from "moment";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  import type { IDayMetadata } from "src/types";

  import { isMobile, key } from "./mobileContext";
  import PopoverMenu from "./popover/PopoverMenu.svelte";
  import Day from "./Day.svelte";
  import Nav from "./Nav.svelte";
  import WeekNum from "./WeekNum.svelte";
  import {
    getDailyMetadata,
    getWeeklyMetadata,
    getMonthlyMetadata,
  } from "../metadata";
  import type { ICalendarSource, IMonth, ISourceSettings } from "../types";
  import { getDaysOfWeek, getMonth, isWeekend } from "../utils";

  // Localization
  export let localeData: Locale;

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
  export let onHoverMonth: (
    date: Moment,
    targetEl: EventTarget,
    isMetaPressed: boolean
  ) => boolean;
  export let onContextMenuDay: (date: Moment, event: MouseEvent) => boolean;
  export let onContextMenuWeek: (date: Moment, event: MouseEvent) => boolean;
  export let onContextMenuMonth: (date: Moment, event: MouseEvent) => boolean;
  export let onClickDay: (date: Moment, isMetaPressed: boolean) => boolean;
  export let onClickWeek: (date: Moment, isMetaPressed: boolean) => boolean;
  export let onClickMonth: (date: Moment, isMetaPressed: boolean) => boolean;

  // External sources (All optional)
  export let sources: ICalendarSource[] = [];
  export let getSourceSettings: (sourceId: string) => ISourceSettings;
  export let selectedId: string;

  // Override-able local state
  export let today: Moment = window.moment();
  export let displayedMonth = today;

  setContext(key, isMobile);

  let month: IMonth;
  let daysOfWeek: string[];

  let hoverTimeout: number;
  let showPopover: boolean = false;
  let popoverMetadata: IDayMetadata[];
  let hoveredDay = writable<HTMLElement>(null);

  $: month = getMonth(displayedMonth, localeData);
  $: daysOfWeek = getDaysOfWeek(today, localeData);

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

  function openPopover() {
    showPopover = true;
  }

  function updatePopover(event: CustomEvent) {
    const { metadata, target } = event.detail;

    if (!showPopover) {
      window.clearTimeout(hoverTimeout);
      hoverTimeout = window.setTimeout(() => {
        if ($hoveredDay === target) {
          openPopover();
        }
      }, 750);
    }

    if ($hoveredDay !== target) {
      hoveredDay.set(target);
      popoverMetadata = metadata;
    }
  }

  const dismissPopover = debounce(
    (event: CustomEvent) => {
      // if the user didn't hover onto another day
      if ($hoveredDay === event.detail.target) {
        hoveredDay.set(null);
        showPopover = false;
      }
    },
    250,
    true
  );
</script>

<div id="calendar-container" class="container">
  <Nav
    today="{today}"
    displayedMonth="{displayedMonth}"
    incrementDisplayedMonth="{incrementDisplayedMonth}"
    decrementDisplayedMonth="{decrementDisplayedMonth}"
    resetDisplayedMonth="{resetDisplayedMonth}"
    metadata="{getMonthlyMetadata(
      sources,
      getSourceSettings,
      displayedMonth,
      today
    )}"
    onClickMonth="{onClickMonth}"
    onContextMenuMonth="{onContextMenuMonth}"
    onHoverMonth="{onHoverMonth}"
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
      {#each month as week (week.weekNum)}
        <tr>
          {#if showWeekNums}
            <WeekNum
              {...week}
              metadata="{getWeeklyMetadata(
                sources,
                getSourceSettings,
                week.days[0],
                today
              )}"
              onClick="{onClickWeek}"
              onContextMenu="{onContextMenuWeek}"
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
              onContextMenu="{onContextMenuDay}"
              onHover="{onHoverDay}"
              metadata="{getDailyMetadata(
                sources,
                getSourceSettings,
                day,
                today
              )}"
              selectedId="{selectedId}"
              on:hoverDay="{updatePopover}"
              on:endHoverDay="{dismissPopover}"
            />
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
  <PopoverMenu
    referenceElement="{$hoveredDay}"
    popoverMetadata="{popoverMetadata}"
    isVisible="{showPopover}"
  />
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
    text-align: center;
    text-transform: uppercase;
  }
</style>
