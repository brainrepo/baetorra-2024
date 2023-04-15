<script lang="ts">
import { defineComponent, toRefs, computed, PropType } from "vue";
import DayCell from "./day-cell.vue";
import AvailabilityCell from "./availabilty-cell.vue";
import ResourceCell from "./resource-cell.vue";
import { getDaysBetween, formatDate } from "../../shared/date";
import TimelineDays from "./timeline-days.vue";
import TimelineDivider from "./timeline-divider.vue";
import ServiceCell from "./service-cell.vue";

export default defineComponent({
  name: "v-timeline",
  components: {
    "v-daycell": DayCell,
    "v-availabilitycell": AvailabilityCell,
    "v-resourcecell": ResourceCell,
    "v-timeline-days": TimelineDays,
    "v-timeline-divider": TimelineDivider,
    "v-servicecell": ServiceCell,
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
      type: Array as PropType<
        Array<{
          id: string;
          name: string;
          resources: { name: string; id: string }[];
          shifts: { id: string; name: string }[];
        }>
      >,
      required: true,
    },
  },
  setup(props) {
    // group -> date -> {id: value}
    const { timetable } = toRefs(props);
    const calendar = computed(() =>
      getDaysBetween(timetable.value?.minDate, timetable.value?.maxDate)
    );

    return { calendar, timetable, formatDate, console };
  },
});
</script>

<template>
  <div class="timetable-table" v-if="timetable">
    <table v-if="calendar.length">
      <v-timeline-days
        :days="calendar"
        :start-blank-columns="2"
      ></v-timeline-days>
      <v-timeline-divider :columns="2 + calendar.length"></v-timeline-divider>

      <tbody v-for="(service, index) in services">
        <tr v-for="(resource, resourceIndex) in service.resources">
          <v-servicecell
            :label="service.name"
            :rowspan="service.resources.length"
            v-if="resourceIndex === 0"
          ></v-servicecell>
          <v-resourcecell :name="resource.name"></v-resourcecell>
          <td
            v-for="day in calendar"
            :class="{'table-row': true, 'odd': index % 2 === 0}"
          >
        
              <template v-for="shift in service.shifts">
                <v-availabilitycell
                  :scheleton="{
                    service: service.id,
                    resource: resource.id,
                    shift: shift.id,
                    date: formatDate(day),
                  }"
                  :amount="
                    timetable.timetable?.[service.id]?.resource[resource.id]
                      ?.dates?.[formatDate(day)]?.[shift.id]?.amount ?? 0
                  "
                  :id="
                    timetable.timetable?.[service.id]?.resource[resource.id]
                      ?.dates?.[formatDate(day)]?.[shift.id]?.id
                  "
                  :lockers="timetable.timetable?.[service.id]?.resource[resource.id]
                      ?.dates?.[formatDate(day)]?.[shift.id]?.lockers"
                  :shift="shift"
                />
              </template>
 
          </td>
        </tr>

        <v-timeline-divider :columns="2 + calendar.length"></v-timeline-divider>
      </tbody>
    </table>
  </div>
</template>
<style lang="scss" scoped>
.timetable-table {
  margin: 30px;
  overflow: scroll;
  position: relative;
  border: 1px solid var(--background-normal);
  max-height: calc(100vh * 2 / 3);
  table {
    table-layout: fixed;
    .table-row{
      vertical-align: top;
      background-color: var(--background-normal);
      &.odd {background-color: var(--background-normal)}
    }
  }

}
</style>
