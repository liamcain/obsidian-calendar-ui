<script lang="ts">
  import Portal from "svelte-portal/src/Portal.svelte";

  import type { IDayMetadata } from "src/types";

  import Box from "./Box.svelte";
  import Popper from "./Popper.svelte";

  export let referenceElement: HTMLElement;
  export let popoverMetadata: IDayMetadata[];
  export let isVisible: boolean;

  let menuItems: IDayMetadata[];
  $: menuItems = (popoverMetadata || [])
    .filter((meta) => ["menu", "calendar-and-menu"].includes(meta.display))
    .sort((a, b) => a.order - b.order);
</script>

<Portal target=".app-container">
  <Popper referenceElement="{referenceElement}" isVisible="{isVisible}">
    <Box menuItems="{menuItems}" />
  </Popper>
</Portal>
