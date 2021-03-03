<script>
  import Popper from "@popperjs/svelte";

  // super-simple CSS Object to string serializer
  const css = (obj) =>
    Object.entries(obj || {})
      .map((x) => x.join(":"))
      .join(";");

  export let isVisible;
  export let referenceElement;
  let popperElement;

  $: popperOptions = {
    modifiers: [
      { name: "offset", options: { offset: [0, 5] } },
      { name: "hide", enabled: true },
    ],
    placement: "bottom-end",
  };

  // bound variables where Popper will store styles and attributes
  let styles = {};
  let attributes = {};
</script>

<Popper
  reference="{referenceElement}"
  popper="{popperElement}"
  options="{popperOptions}"
  bind:styles
  bind:attributes
>
  <div
    class="popper"
    class:hidden="{!referenceElement || !isVisible}"
    bind:this="{popperElement}"
    style="{css(styles.popper)}"
    {...attributes.popper}
  >
    <slot />
  </div>
</Popper>

<style>
  .popper {
    transition: opacity 0.1s ease-in;
    opacity: 1;
    pointer-events: none;
    z-index: var(--layer-popover);
  }

  /* Hide the popper when the reference is hidden */
  .popper.hidden {
    opacity: 0;
  }
</style>
