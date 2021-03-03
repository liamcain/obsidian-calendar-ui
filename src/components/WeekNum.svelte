<svelte:options immutable />

<script lang="ts">
  import type { Moment } from "moment";
  import { getDateUID } from "obsidian-daily-notes-interface";

  import Dots from "./Dots.svelte";
  import MetadataResolver from "./MetadataResolver.svelte";
  import type { IDayMetadata } from "../types";
  import { getStartOfWeek, isMetaPressed } from "../utils";
  import { createEventDispatcher } from "svelte";

  // Properties
  export let weekNum: number;
  export let days: Moment[];
  export let metadata: Promise<IDayMetadata[]> | null;

  // Event handlers
  export let onHover: (
    date: Moment,
    targetEl: EventTarget,
    isMetaPressed: boolean
  ) => boolean;
  export let onClick: (date: Moment, isMetaPressed: boolean) => boolean;
  export let onContextMenu: (date: Moment, event: MouseEvent) => boolean;

  // Global state;
  export let selectedId: string = null;

  let startOfWeek: Moment;
  $: startOfWeek = getStartOfWeek(days);

  const dispatch = createEventDispatcher();

  function handleHover(event: PointerEvent) {
    onHover?.(days[0], event.target, isMetaPressed(event));
    dispatch("hoverDay", {
      date: days[0],
      metadata,
      target: event.target,
    });
  }
</script>

<td>
  <MetadataResolver metadata="{metadata}" let:metadata>
    <div
      class="week-num"
      class:active="{selectedId === getDateUID(days[0], 'week')}"
      on:click="{onClick && ((e) => onClick(startOfWeek, isMetaPressed(e)))}"
      on:contextmenu="{onContextMenu && ((e) => onContextMenu(days[0], e))}"
      on:pointerover="{handleHover}"
    >
      {weekNum}
      <Dots metadata="{metadata}" />
    </div>
  </MetadataResolver>
</td>

<style>
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
  }

  .week-num:hover {
    background-color: var(--interactive-hover);
  }

  .week-num.active:hover {
    background-color: var(--interactive-accent-hover);
  }

  .active {
    color: var(--text-on-accent);
    background-color: var(--interactive-accent);
  }
</style>
