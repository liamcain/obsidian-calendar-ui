<script lang="ts">
  import type { Moment } from "moment";
  import { createEventDispatcher, getContext } from "svelte";
  import type { Writable } from "svelte/store";

  import { evaluateMetadataFromSources } from "src/utils";

  import { DISPLAYED_MONTH } from "../context";
  import Dots from "./Dots.svelte";
  import MetadataResolver from "./MetadataResolver.svelte";
  import type {
    CalendarEventHandlers,
    ICalendarSource,
    IEvaluatedMetadata,
  } from "../types";

  export let eventHandlers: CalendarEventHandlers;
  export let sources: ICalendarSource[];
  let metadata: Promise<IEvaluatedMetadata>;

  let displayedMonth = getContext<Writable<Moment>>(DISPLAYED_MONTH);
  const dispatch = createEventDispatcher();

  $: metadata = evaluateMetadataFromSources(sources, "month", $displayedMonth);

  function handleHover(event: PointerEvent, meta: IEvaluatedMetadata) {
    const date = $displayedMonth;
    eventHandlers.onHover?.("month", date, event);
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
    draggable="{true}"
    on:click="{(e) => eventHandlers.onClick?.('month', $displayedMonth, e)}"
    on:contextmenu="{metadata &&
      eventHandlers.onContextMenu &&
      ((e) => eventHandlers.onContextMenu('month', $displayedMonth, e))}"
    on:pointerenter="{(event) => handleHover(event, metadata)}"
    on:pointerleave="{endHover}"
  >
    <!-- on:dragstart="{(event) => fileCache.onDragStart(event, file)}" -->
    <span class="title">
      <span class="month">
        {$displayedMonth.format("MMMM")}
      </span>
      <span class="year">
        {$displayedMonth.format("YYYY")}
      </span>
    </span>
    {#if metadata}
      <Dots metadata="{metadata}" centered="{false}" />
    {/if}
  </div>
</MetadataResolver>

<style>
  .title {
    color: var(--color-text-title);
    cursor: pointer;
    display: flex;
    font-size: 1.25em;
    gap: 0.3em;
    margin: 0;
    margin-bottom: 0.1em;
  }

  .month {
    font-weight: 500;
  }

  .year {
    color: var(--interactive-accent);
  }
</style>
