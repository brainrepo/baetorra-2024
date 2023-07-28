<script lang="ts">
import { defineComponent, ref, watch, toRefs } from "vue";
import { format, isWeekend as isWeekendCheck } from "date-fns";

export default defineComponent({
  name: "v-variantcell",
  props: {
    name: { type: String, required: true },
  },
});
</script>

<template>
  <td class="variantcell">
    <div>{{ name }}</div>
  </td>
</template>

<style lang="scss">
.variantcell {
  background-color: var(--background-page);
  color: var(--foreground-normal);
  font-size: 8px;
  padding: 12px;
  line-height: 12px;
  border-radius: 4px;
  text-transform: capitalize;
  z-index: 10;
}
</style>
