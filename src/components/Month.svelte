<script lang="ts">
  import type { Moment } from "moment";

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
</script>

<div
  class="dot-container"
  on:click="{onClick && ((e) => onClick(displayedMonth, isMetaPressed(e)))}"
  on:contextmenu="{onContextMenu && ((e) => onContextMenu(displayedMonth, e))}"
  on:pointerover="{onHover &&
    ((e) => onHover(displayedMonth, e.target, isMetaPressed(e)))}"
>
  <MetadataResolver metadata="{metadata}" let:metadata>
    <Dots metadata="{metadata}" />
  </MetadataResolver>
</div>
