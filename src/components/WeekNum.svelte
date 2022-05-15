<svelte:options immutable />

<script lang="ts">
  import type { Moment } from "moment";
  import { createEventDispatcher, getContext } from "svelte";
  import type { Writable } from "svelte/store";

  import { TODAY } from "src/context";
  import { evaluateMetadataFromSources } from "src/utils";

  import Dots from "./Dots.svelte";
  import MetadataResolver from "./MetadataResolver.svelte";
  import type {
    CalendarEventHandlers,
    ICalendarSource,
    IEvaluatedMetadata,
  } from "../types";

  const dispatch = createEventDispatcher();

  // Properties
  export let weekNum: number;
  export let days: Moment[];
  export let sources: ICalendarSource[];
  export let eventHandlers: CalendarEventHandlers;

  let metadata: Promise<IEvaluatedMetadata>;

  const today = getContext<Writable<Moment>>(TODAY);

  $: metadata = evaluateMetadataFromSources(sources, "week", days[0], $today);

  function handleHover(event: PointerEvent, meta: IEvaluatedMetadata) {
    eventHandlers.onHover?.("week", days[0], event);
    dispatch("hoverDay", {
      date: days[0],
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
      class="week-num"
      draggable="{true}"
      on:click="{eventHandlers.onClick &&
        ((e) => eventHandlers.onClick('week', days[0], e))}"
      on:contextmenu="{eventHandlers.onContextMenu &&
        ((e) => eventHandlers.onContextMenu('week', days[0], e))}"
      on:pointerenter="{(event) => handleHover(event, metadata)}"
      on:pointerleave="{endHover}"
    >
      <!-- on:dragstart="{(event) => fileCache.onDragStart(event, file)}" -->
      <!-- class:active="{selectedId === getDateUID(days[0], 'week')}" -->
      {weekNum}
      <Dots metadata="{metadata}" />
    </div>
  </MetadataResolver>
</td>

<style lang="scss">
  td {
    border-right: 1px solid var(--background-modifier-border);
  }

  .week-num {
    background-color: var(--color-background-weeknum);
    border-radius: 4px;
    color: var(--color-text-weeknum);
    cursor: pointer;
    font-size: 0.65em;
    height: 100%;
    padding: 4px;
    text-align: center;
    transition: background-color 0.1s ease-in, color 0.1s ease-in;
    vertical-align: baseline;

    &:hover {
      background-color: var(--interactive-hover);
    }

    // &.active:hover {
    //   background-color: var(--interactive-accent-hover);
    // }
  }

  // .active {
  //   color: var(--text-on-accent);
  //   background-color: var(--interactive-accent);
  // }
</style>
