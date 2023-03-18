<script lang="ts">
import { defineComponent, toRefs, watch, ref } from "vue";
import DayCell from "./day-cell.vue";
import AvailabilityCell from "./availabilty-cell.vue";
import VariantCell from "./variant-cell.vue";
import { numDays, addDay, formatDate } from "../utils/utils";

export default defineComponent({
  name: "v-timeline",
  components: {
    "v-daycell": DayCell,
    "v-availabilitycell": AvailabilityCell,
    "v-variantcell": VariantCell,
  },
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
    services: {
      type: Array,
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

    return { calendar, timetable, formatDate, console };
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

      <tbody v-for="(service, key) in services">
        <tr>
          <td
            :colspan="calendar.length + 1"
            style="
              background-color: var(--primary) !important;
              color: var(--foreground-inverted);
              position: sticky;
            "
          >
            {{ service.name }}
          </td>
        </tr>

        <tr v-for="(resource, _, index) in service.resources">
          <v-variantcell :name="resource.name"></v-variantcell>
          <td v-for="day in calendar">
            <div class="cell">
              <template v-for="shift in service.shifts">
          
    
                <v-availabilitycell
                  :scheleton="{
                    service: service.id,
                    resource: resource.id,
                    shift: shift.id,
                    date: formatDate(day)
                  }"
                  :amount="
                    timetable.timetable?.[service.id]?.resource[resource.id]
                      ?.dates?.[formatDate(day)]?.[shift.id]?.amount ?? 0
                  "
                  :id="
                    timetable.timetable?.[service.id]?.resource[resource.id]
                      ?.dates?.[formatDate(day)]?.[shift.id]?.id
                  "
                  :shift="shift"
            />

            
            </template>
            </div>
          </td>
        </tr>
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
      font-size: 12px;
      padding: 6px;
      border-radius: 4px;
    }

    td.borderbottom {
      border-bottom: 1px dashed var(--foreground-subdued);
    }
    .cell {
      display: flex;
      flex-direction: row;
    }
  }
}
</style>
