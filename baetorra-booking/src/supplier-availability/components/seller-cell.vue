<script lang="ts">
import { defineComponent, ref, watch, toRefs } from "vue";
import { format, isWeekend as isWeekendCheck } from "date-fns";

export default defineComponent({
  name: "v-sellercell",
  props: {
    name: { type: String, required: true },
  },
});
</script>

<template>
  <td class="sellercell">
    <div style="sticky">{{ name }}</div>
  </td>
</template>

<style lang="scss">
.daycell.weekend {
  background-color: var(--background-subdued);
  color: var(--foreground-subdued);
}

.sellercell {
  background-color: var(--background-normal);
  color: var(--foreground-normal);
  font-size: 10px;
  padding: 12px;
  line-height: 12px;
  border-radius: 4px;
  text-transform: uppercase;

}
</style>
