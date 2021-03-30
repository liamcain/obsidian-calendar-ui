<script lang="ts">
  import type { Moment } from "moment";

  import Arrow from "./Arrow.svelte";
  import Dot from "./Dot.svelte";
  import Month from "./Month.svelte";
  import type { IDayMetadata } from "../types";

  export let displayedMonth: Moment;
  export let today: Moment;
  export let metadata: Promise<IDayMetadata[]> | null;

  export let onHoverMonth: (
    date: Moment,
    targetEl: EventTarget,
    isMetaPressed: boolean
  ) => boolean;
  export let onClickMonth: (date: Moment, isMetaPressed: boolean) => boolean;
  export let onContextMenuMonth: (date: Moment, event: MouseEvent) => boolean;

  export let resetDisplayedMonth: () => void;
  export let incrementDisplayedMonth: () => void;
  export let decrementDisplayedMonth: () => void;

  let showingCurrentMonth: boolean;
  $: showingCurrentMonth = displayedMonth.isSame(today, "month");
</script>

<div class="nav">
  <Month
    displayedMonth="{displayedMonth}"
    onClick="{onClickMonth}"
    onHover="{onHoverMonth}"
    onContextMenu="{onContextMenuMonth}"
    metadata="{metadata}"
    on:hoverDay
    on:endHoverDay
  />
  <div class="right-nav">
    <Arrow
      direction="left"
      onClick="{decrementDisplayedMonth}"
      tooltip="Previous Month"
    />
    <div
      aria-label="{!showingCurrentMonth ? 'Reset to current month' : null}"
      class="reset-button"
      class:active="{!showingCurrentMonth}"
      on:click="{resetDisplayedMonth}"
    >
      <Dot isFilled />
    </div>
    <Arrow
      direction="right"
      onClick="{incrementDisplayedMonth}"
      tooltip="Next Month"
    />
  </div>
</div>

<style>
  .nav {
    align-items: baseline;
    display: flex;
    margin: 0.6em 0 1em;
    padding: 0 8px;
    width: 100%;
  }

  .right-nav {
    align-items: center;
    display: flex;
    justify-content: center;
    margin-left: auto;
  }

  .reset-button {
    align-items: center;
    color: var(--color-arrow);
    display: flex;
    opacity: 0.4;
    padding: 0.5em;
  }

  .reset-button.active {
    cursor: pointer;
    opacity: 1;
  }
</style>
