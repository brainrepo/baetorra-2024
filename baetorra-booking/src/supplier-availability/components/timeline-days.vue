<script lang="ts">
import { defineComponent } from "vue";
import DayCell from "./day-cell.vue";

export default defineComponent({
  name: "TimelineDays",
  components: {"v-daycell": DayCell},
  props: {
    days: { type: Array, required: true },
    startBlankColumns: {type: Number, required: true}
  }
});
</script>

<template>
  <tbody>
    <tr>
      <th :colspan="startBlankColumns"></th>
      <v-daycell v-for="(day, index) in days" :date="day" />
    </tr>
  </tbody>
</template>
