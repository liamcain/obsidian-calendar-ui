<script lang="ts">
  export let isFilled: boolean;
  export let isActive: boolean;
</script>

{#if isFilled}
  <svg
    class="dot"
    class:active="{isActive}"
    viewBox="0 0 6 6"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="3" cy="3" r="2"></circle>
  </svg>
{:else}
  <svg
    class="hollow"
    class:active="{isActive}"
    viewBox="0 0 6 6"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="3" cy="3" r="2"></circle>
  </svg>
{/if}

<style>
  .dot,
  .hollow {
    display: inline-block;
    fill: var(--color-dot);
    height: 6px;
    width: 6px;
    margin: 0 1px;
  }

  .active.dot {
    fill: var(--text-on-accent);
  }

  .hollow {
    fill: none;
    stroke: var(--color-dot);
  }

  .active.hollow {
    stroke: var(--text-on-accent);
  }
</style>
