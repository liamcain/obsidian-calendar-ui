<script lang="ts">
  import Portal from "svelte-portal/src/Portal.svelte";

  import type { IDayMetadata } from "src/types";

  import Box from "./Box.svelte";
  import Popper from "./Popper.svelte";

  export let referenceElement: HTMLElement;
  export let popoverMetadata: IDayMetadata[];
  export let isVisible: boolean;

  // let menuItems: IMenuItem[] = [
  //   { color: "#7FA1C0", name: "words", value: 250, isShowcased: true },
  //   { color: "#BF616A", name: "tasks", value: 3, goal: 5, isShowcased: true },
  //   { color: "#7FA1C0", name: "Zettels", value: 3 },
  //   { color: "#7FA1C0", name: "Links", value: 5 },
  //   { color: "#7FA1C0", name: "Backlinks", value: 0 },
  // ];
</script>

<Portal target=".app-container">
  <Popper referenceElement="{referenceElement}" isVisible="{isVisible}">
    <Box menuItems="{popoverMetadata}" />
  </Popper>
</Portal>
