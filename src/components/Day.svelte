<svelte:options immutable />

<script lang="ts">
  import type { Moment } from "moment";
  import { createEventDispatcher, getContext } from "svelte";
  import type { Writable } from "svelte/store";

  import Dots from "./Dots.svelte";
  import MetadataResolver from "./MetadataResolver.svelte";

  import { DISPLAYED_MONTH, IS_MOBILE, TODAY } from "src/context";
  import type {
    CalendarEventHandlers,
    ICalendarSource,
    IEvaluatedMetadata,
  } from "src/types";
  import { evaluateMetadataFromSources } from "src/utils";

  // Properties
  export let date: Moment;
  export let sources: ICalendarSource[];
  export let isActive: boolean;

  export let eventHandlers: CalendarEventHandlers;

  // Global state
  const today = getContext<Writable<Moment>>(TODAY);
  const isMobile = getContext<boolean>(IS_MOBILE);
  const displayedMonth = getContext<Writable<Moment>>(DISPLAYED_MONTH);
  const dispatch = createEventDispatcher();

  let metadata: Promise<IEvaluatedMetadata>;

  $: metadata = evaluateMetadataFromSources(sources, "day", date, $today);

  function handleClick(event: MouseEvent) {
    console.log("\n\nclicked", event);
    eventHandlers.onClick?.("day", date, event);
    // if (isMobile) {
    //   dispatch("hoverDay", {
    //     date,
    //     metadata: meta,
    //     target: event.target,
    //   });
    // }
  }

  function handleHover(event: PointerEvent) {
    eventHandlers.onHover?.("day", date, event);
    // dispatch("hoverDay", {
    //   date,
    //   metadata: meta,
    //   target: event.target,
    // });
  }

  function endHover(event: MouseEvent) {
    dispatch("endHoverDay", {
      target: event.target,
    });
  }

  function handleContextmenu(event: MouseEvent) {
    eventHandlers.onContextMenu?.("day", date, event);
    endHover(event);
  }
</script>

<td class="day-container">
  <div
    class="day"
    class:adjacent-month="{!date.isSame($displayedMonth, 'month')}"
    class:today="{date.isSame($today, 'day')}"
    class:active="{isActive}"
    on:click="{handleClick}"
    on:mousedown="{(e) => console.log('mousedown')}"
    on:contextmenu="{handleContextmenu}"
    on:pointerenter="{handleHover}"
    on:pointerleave="{endHover}"
  >
    <!-- draggable="{true}" -->
    <!--</div>="{date.isSame(today, 'day')}" -->
    <!-- {...getAttributes(metadata)} -->
    <!-- on:dragstart="{(event) => fileCache.onDragStart(event, file)}" -->
    {date.format("D")}
    <MetadataResolver metadata="{metadata}" let:metadata>
      <Dots metadata="{metadata}" />
    </MetadataResolver>
  </div>
</td>

<style lang="scss">
  .day-container {
    height: 1px;
    vertical-align: top;
  }

  .day {
    background-color: var(--color-background-day);
    border-radius: 4px;
    color: var(--color-text-day);
    cursor: pointer;
    font-size: 0.8em;
    height: 100%;
    padding: 4px;
    text-align: center;
    transition: background-color 0.1s ease-in, color 0.1s ease-in;

    &:hover {
      background-color: var(--interactive-hover);
    }

    &.active,
    &.active.today {
      color: var(--text-on-accent);
      background-color: var(--interactive-accent);
    }

    &.active:hover {
      background-color: var(--interactive-accent-hover);
    }
  }

  .adjacent-month {
    opacity: 0.25;
  }

  .today {
    color: var(--color-text-today);
  }
</style>
