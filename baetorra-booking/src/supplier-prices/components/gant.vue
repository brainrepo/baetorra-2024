<script lang="ts">
import { defineComponent, toRefs, watch, ref } from "vue";
import DayCell from "./day-cell.vue";
import PriceCell from "./price-cell.vue";
import { numDays, addDay, formatDate } from "../utils/utils";

export default defineComponent({
  name: "v-timeline",
  components: { "v-daycell": DayCell, "v-pricecell": PriceCell },
  props: {
    timetable: {
      type: Object,
    },
    minDate: {
      type: String,
      required: true,
    },
    maxDate: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    // group -> date -> {id: value}
    const { timetable } = toRefs(props);
    const calendar = ref<Array<Date>>([]);

    watch(
      timetable,
      (data) => {
        const days = numDays(data.maxDate, data.minDate) + 1;
        calendar.value = Array(days)
          .fill("-")
          .map((e, i) => addDay(data.minDate, i));
      },
      {
        immediate: true,
        deep: true,
      }
    );

    return { calendar, timetable, formatDate };
  },
});
</script>

<template>
  <div class="timetable-table">
    <table v-if="calendar.length">
      <tr>
        <th></th>
        <v-daycell v-for="(day, index) in calendar" :date="day" />
      </tr>

      <tbody v-for="(service, key) in timetable.timetable">
        <tr>
          <td
            :colspan="calendar.length + 1"
            style="
              background-color: var(--primary) !important;
              color: var(--foreground-inverted);
            "
          >
            {{ service.name }}
          </td>
        </tr>
        <template v-for="seller in service.sellers">
          <tr>
            <td>
              <div style="sticky">{{ seller.name }}</div>
            </td>
            <td
              :colspan="calendar.length"
              style="background-color: var(--background-subdued)"
            ></td>
          </tr>
          <tr v-for="(variant, index) in seller.variants">
            <td style="padding-left: 10px; border-left: 8px solid white">
              {{ variant.name }}
            </td>
            <td v-for="day in calendar">
              <v-pricecell
                v-if="variant?.prices?.[formatDate(day)]"
                :price="variant.prices[formatDate(day)]"
              >
              </v-pricecell>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
<style lang="scss">
.timetable-table {
  margin: 30px;
  overflow-x: scroll;
  position: relative;
  border: 1px solid var(--background-normal);
  table {
    table-layout: fixed;
    td:first-child {
      position: sticky;
      left: 0;
      background-color: var(--background-normal);
      font-size: 12px;
      padding: 6px;
      border-radius: 4px;
    }

    td {
      min-width: 80px;
      max-width: 80px;
    }
  }
}
</style>
