<script lang="ts">
  import type { Moment } from "moment";
  import type { TFile } from "obsidian";
  import { createEventDispatcher, getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import type { IGranularity } from "obsidian-daily-notes-interface";

  import { DISPLAYED_MONTH } from "../context";
  import Dots from "./Dots.svelte";
  import type PeriodicNotesCache from "../fileStore";
  import MetadataResolver from "./MetadataResolver.svelte";
  import { isMetaPressed } from "../utils";
  import type { IDayMetadata, ISourceSettings } from "../types";

  export let fileCache: PeriodicNotesCache;
  export let getSourceSettings: (sourceId: string) => ISourceSettings;
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

  let displayedMonth = getContext<Writable<Moment>>(DISPLAYED_MONTH);
  let metadata: Promise<IDayMetadata[]> | null;

  const dispatch = createEventDispatcher();

  $: metadata = fileCache.getEvaluatedMetadata(
    "month",
    $displayedMonth,
    getSourceSettings
  );

  let file: TFile | null;
  fileCache.store.subscribe(() => {
    file = fileCache.getFile($displayedMonth, "month");
  });

  function handleHover(event: PointerEvent, meta: IDayMetadata) {
    const date = $displayedMonth;
    onHover?.("month", date, file, event.target, isMetaPressed(event));
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

<MetadataResolver metadata="{metadata}" let:metadata>
  <div
    on:click="{onClick &&
      ((e) => onClick('month', $displayedMonth, file, isMetaPressed(e)))}"
    on:contextmenu="{onContextMenu &&
      ((e) => onContextMenu('month', $displayedMonth, file, e))}"
    on:pointerenter="{(event) => handleHover(event, metadata)}"
    on:pointerleave="{endHover}"
  >
    <span class="title">
      <span class="month">
        {$displayedMonth.format("MMM")}
      </span>
      <span class="year">
        {$displayedMonth.format("YYYY")}
      </span>
    </span>
    <Dots metadata="{metadata}" centered="{false}" />
  </div>
</MetadataResolver>

<style>
  .title {
    color: var(--color-text-title);
    cursor: pointer;
    display: flex;
    font-size: 1.4em;
    gap: 0.3em;
    margin: 0;
  }

  .month {
    font-weight: 500;
  }

  .year {
    color: var(--interactive-accent);
  }
</style>