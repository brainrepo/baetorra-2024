<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ServiceCell",
  props: {
    label: { type: String, required: true },
    rowspan: { type: Number, required: true },
  },
});
</script>

<template>
  <td
    :rowspan="rowspan"
  >
    <div>{{ label }}</div>
  </td>
</template>
<style lang="scss" scoped>
   td {
      position: sticky;
      left: 0px;
      z-index: 10;
      background-color: var(--primary);
      border-radius: 4px;
      & > div {
        writing-mode: vertical-rl;
        text-orientation: mixed;
        font-size: 10px;
        text-align: center;
        transform: rotate(180deg);
        width: 40px !important;
        height: 100px;
        line-height: 10px;
        overflow: hidden;
        padding: 10px;
        font-weight: bold;
        
        color: var(--foreground-inverted);
        text-transform: uppercase;
        
      }
    }
</style>