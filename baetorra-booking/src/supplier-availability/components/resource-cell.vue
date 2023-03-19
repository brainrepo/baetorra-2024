<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ResourceCell",
  props: {
    name: { type: String, required: true },
  },
});
</script>

<template>
  <td class="resourcecell">
    <div>{{ name }}</div>
  </td>
</template>

<style lang="scss">
.resourcecell {
  background-color: var(--background-normal);
  color: var(--foreground-normal);
  font-size: 10px;
  position: sticky;
  left: 42px;
  padding: 12px;
  line-height: 12px;
  border-radius: 4px;
  text-transform: uppercase;
  z-index: 10;
}
</style>
