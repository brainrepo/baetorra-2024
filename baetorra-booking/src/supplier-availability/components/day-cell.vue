<script lang="ts">
import { defineComponent, ref, watch, toRefs } from "vue";
import {
  format,
  isToday as isTodayCheck,
  isWeekend as isWeekendCheck,
} from "date-fns";

export default defineComponent({
  name: "v-daycell",
  props: {
    date: { type: Date, required: true },
  },
  setup(props) {
    const { date } = toRefs(props);
    const isWeekend = ref(false);
    const isToday = ref(false);
    const formatDateDay = (date: Date) => {
      return format(date, "dd");
    };

    const formatDateMonth = (date: Date) => {
      return format(date, "MMMM");
    };

    const formatDateWeekDay = (date: Date) => {
      return format(date, "EEEE");
    };

    watch(
      date,
      () => {
        isWeekend.value = isWeekendCheck(date.value);
        isToday.value = isTodayCheck(date.value);
      },
      {
        immediate: true,
      }
    );
    return {
      formatDateWeekDay,
      formatDateDay,
      formatDateMonth,
      isWeekend,
      isToday,
    };
  },
});
</script>

<template>
  <th :class="{ daycell: true, weekend: isWeekend, today: isToday }">
    <div class="top">{{ formatDateWeekDay(date) }}</div>
    <div class="big">{{ formatDateDay(date) }}</div>
    <div class="bottom">{{ formatDateMonth(date) }}</div>
  </th>
</template>

<style lang="scss" scoped>

.daycell.weekend {
  background-color: var(--background-subdued);
  color: var(--foreground-subdued);
}

.daycell {
  position: sticky;
  top: 0px;
  z-index: 10;
  background-color: var(--background-normal);
  color: var(--foreground-normal);
  font-size: 12px;
  padding: 12px;
  line-height: 12px;
  border-radius: 4px;
  overflow: hidden;
  &.today {
    color: var(--white);
    background-color: var(--primary);
  }
  .big {
    font-size: 26px;
    line-height: 26px;
    font-family: var(--family-sans-serif);
  }
  .top {
    font-weight: bold;
    text-transform: uppercase;
    font-size: 10px;
  }
  .bottom {
    font-size: 9px;
    font-weight: bold;
    text-transform: uppercase;
    opacity: 0.8;
  }
}
</style>
