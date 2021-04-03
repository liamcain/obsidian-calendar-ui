<svelte:options immutable />

<script lang="ts">
  import type { Moment } from "moment";
  import type { TFile } from "obsidian";
  import { getDateUID, IGranularity } from "obsidian-daily-notes-interface";
  import { createEventDispatcher, getContext } from "svelte";
  import type { Writable } from "svelte/store";

  import Dots from "./Dots.svelte";
  import MetadataResolver from "./MetadataResolver.svelte";
  import { DISPLAYED_MONTH, IS_MOBILE } from "../context";
  import type PeriodicNotesCache from "../fileStore";
  import type { IDayMetadata, ISourceSettings } from "../types";
  import { isMetaPressed } from "../utils";

  // Properties
  export let date: Moment;
  export let fileCache: PeriodicNotesCache;
  export let getSourceSettings: (sourceId: string) => ISourceSettings;

  let file: TFile | null;

  export let onHover: (
    periodicity: IGranularity,
    date: Moment,
    file: TFile,
    targetEl: EventTarget,
    isMetaPressed: boolean
  ) => boolean;
  export let onClick: (
    granularity: IGranularity,
    date: Moment,
    existingFile: TFile,
    inNewSplit: boolean
  ) => boolean;
  export let onContextMenu: (
    granularity: IGranularity,
    date: Moment,
    file: TFile,
    event: MouseEvent
  ) => boolean;

  // Global state
  export let today: Moment;
  export let selectedId: string = null;
  const isMobile = getContext<boolean>(IS_MOBILE);
  const displayedMonth = getContext<Writable<Moment>>(DISPLAYED_MONTH);
  const dispatch = createEventDispatcher();

  let metadata: Promise<IDayMetadata[]> | null;

  fileCache.store.subscribe(() => {
    file = fileCache.getFile(date, "day");
    metadata = fileCache.getEvaluatedMetadata("day", date, getSourceSettings);
  });

  function handleClick(event: MouseEvent, meta: IDayMetadata) {
    onClick?.("day", date, file, isMetaPressed(event));
    if (isMobile) {
      dispatch("hoverDay", {
        date,
        metadata: meta,
        target: event.target,
      });
    }
  }

  function handleHover(event: PointerEvent, meta: IDayMetadata) {
    onHover?.("day", date, file, event.target, isMetaPressed(event));
    dispatch("hoverDay", {
      date,
      metadata: meta,
      target: event.target,
    });
  }

  function endHover(event: PointerEvent) {
    dispatch("endHoverDay", {
      target: event.target,
    });
  }
</script>

<td>
  <MetadataResolver metadata="{metadata}" let:metadata>
    <div
      class="day"
      class:active="{selectedId === getDateUID(date, 'day')}"
      class:adjacent-month="{!date.isSame($displayedMonth, 'month')}"
      class:has-note="{!!file}"
      class:today="{date.isSame(today, 'day')}"
      draggable="{true}"
      on:click="{(event) => handleClick(event, metadata)}"
      on:contextmenu="{onContextMenu &&
        ((e) => onContextMenu('day', date, file, e))}"
      on:pointerenter="{(event) => handleHover(event, metadata)}"
      on:pointerleave="{endHover}"
      on:dragstart="{(event) => fileCache.onDragStart(event, file)}"
    >
      {date.format("D")}
      <Dots metadata="{metadata}" />
    </div>
  </MetadataResolver>
</td>

<style>
  .day {
    background-color: var(--color-background-day);
    border-radius: 4px;
    color: var(--color-text-day);
    cursor: pointer;
    font-size: 0.8em;
    height: 100%;
    padding: 4px;
    position: relative;
    text-align: center;
    transition: background-color 0.1s ease-in, color 0.1s ease-in;
    vertical-align: baseline;
  }
  .day:hover {
    background-color: var(--interactive-hover);
  }

  .day.active:hover {
    background-color: var(--interactive-accent-hover);
  }

  .adjacent-month {
    opacity: 0.25;
  }

  .today {
    color: var(--color-text-today);
  }

  .day:active,
  .active,
  .active.today {
    color: var(--text-on-accent);
    background-color: var(--interactive-accent);
  }
</style>
