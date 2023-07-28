<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TimelineDivider",
  props: {
    columns: {type: Number, required: true}
  }
});
</script>

<template>
  <tr>
    <td
      :colspan="columns"
      class="divider"
    ></td>
  </tr>
</template>
<style scoped>
.divider{
    border-bottom: 1px solid var(--border-normal); height: 1px
}
</style>