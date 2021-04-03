<svelte:options immutable />

<script lang="ts">
  import { App, debounce } from "obsidian";
  import type { Locale, Moment } from "moment";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  import type { IDayMetadata } from "src/types";

  import { DISPLAYED_MONTH, IS_MOBILE } from "../context";
  import PopoverMenu from "./popover/PopoverMenu.svelte";
  import Day from "./Day.svelte";
  import Nav from "./Nav.svelte";
  import WeekNum from "./WeekNum.svelte";
  import type { ICalendarSource, IMonth, ISourceSettings } from "../types";
  import { getDaysOfWeek, getMonth, isWeekend } from "../utils";
  import PeriodicNotesCache from "../fileStore";

  export let localeData: Locale;
  export let showWeekNums: boolean = false;
  export let eventHandlers: CallableFunction[];

  // External sources (All optional)
  export let app: App;
  export let sources: ICalendarSource[] = [];
  export let getSourceSettings: (sourceId: string) => ISourceSettings;
  export let selectedId: string;

  // Override-able local state
  export let today: Moment = window.moment();
  export let displayedMonth: Moment = today;

  setContext(IS_MOBILE, (window.app as any).isMobile);

  let displayedMonthStore = writable<Moment>(displayedMonth);
  setContext(DISPLAYED_MONTH, displayedMonthStore);

  let month: IMonth;
  let daysOfWeek: string[];

  let hoverTimeout: number;
  let showPopover: boolean = false;
  let popoverMetadata: IDayMetadata[];
  let hoveredDay = writable<HTMLElement>(null);

  $: month = getMonth($displayedMonthStore, localeData);
  $: daysOfWeek = getDaysOfWeek(today, localeData);

  const fileCache = new PeriodicNotesCache(app, sources);

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
    fileCache="{fileCache}"
    today="{today}"
    getSourceSettings="{getSourceSettings}"
    eventHandlers="{eventHandlers}"
    on:hoverDay="{updatePopover}"
    on:endHoverDay="{dismissPopover}"
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
              fileCache="{fileCache}"
              selectedId="{selectedId}"
              getSourceSettings="{getSourceSettings}"
              {...week}
              {...eventHandlers}
              on:hoverDay="{updatePopover}"
              on:endHoverDay="{dismissPopover}"
            />
          {/if}
          {#each week.days as day (day.format())}
            <Day
              date="{day}"
              fileCache="{fileCache}"
              getSourceSettings="{getSourceSettings}"
              today="{today}"
              selectedId="{selectedId}"
              {...eventHandlers}
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
    metadata="{popoverMetadata}"
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
