<script lang="ts">
  import type { Moment } from "moment";
  import { createEventDispatcher } from "svelte";

  import Dots from "./Dots.svelte";
  import MetadataResolver from "./MetadataResolver.svelte";
  import { isMetaPressed } from "../utils";
  import type { IDayMetadata } from "../types";

  export let displayedMonth: Moment;
  export let metadata: Promise<IDayMetadata[]> | null;

  export let onHover: (
    date: Moment,
    targetEl: EventTarget,
    isMetaPressed: boolean
  ) => boolean;
  export let onClick: (date: Moment, isMetaPressed: boolean) => boolean;
  export let onContextMenu: (date: Moment, event: MouseEvent) => boolean;

  const dispatch = createEventDispatcher();

  function handleHover(event: PointerEvent, meta: IDayMetadata) {
    onHover?.(displayedMonth, event.target, isMetaPressed(event));
    dispatch("hoverDay", {
      displayedMonth,
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
    on:click="{onClick && ((e) => onClick(displayedMonth, isMetaPressed(e)))}"
    on:contextmenu="{onContextMenu &&
      ((e) => onContextMenu(displayedMonth, e))}"
    on:pointerenter="{(event) => handleHover(event, metadata)}"
    on:pointerleave="{endHover}"
  >
    <span class="title">
      <span class="month">
        {displayedMonth.format("MMM")}
      </span>
      <span class="year">
        {displayedMonth.format("YYYY")}
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
