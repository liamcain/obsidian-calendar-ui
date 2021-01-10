<script lang="ts">
  import type { Moment } from "moment";

  import ResolvedDay from "./ResolvedDay.svelte";
  import type { IDayMetadata } from "../types";

  // Properties
  export let date: Moment;
  export let metadata: Promise<IDayMetadata> | null;
  export let onHover: (
    date: Moment,
    targetEl: EventTarget,
    isMetaPressed: boolean
  ) => boolean;
  export let onClick: (date: Moment, isMetaPressed: boolean) => boolean;
  export let onContextMenu: (date: Moment, event: MouseEvent) => boolean;

  // Global state
  export let today: Moment;
  export let displayedMonth: Moment = null;
  export let selectedId: string = null;
</script>

<svelte:options immutable />
<td>
  {#if metadata}
    {#await metadata then resolvedMeta}
      <ResolvedDay
        metadata="{resolvedMeta}"
        date="{date}"
        selectedId="{selectedId}"
        displayedMonth="{displayedMonth}"
        today="{today}"
        onClick="{onClick}"
        onHover="{onHover}"
        onContextMenu="{onContextMenu}"
      />
    {/await}
  {:else}
    <ResolvedDay
      date="{date}"
      displayedMonth="{displayedMonth}"
      selectedId="{selectedId}"
      today="{today}"
      onClick="{onClick}"
      onHover="{onHover}"
    />
  {/if}
</td>
