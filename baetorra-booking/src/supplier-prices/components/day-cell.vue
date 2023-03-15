<script lang="ts">
import { defineComponent, ref, watch, toRefs } from "vue";
import { format, isWeekend as isWeekendCheck } from "date-fns";

export default defineComponent({
  name: "v-daycell",
  props: {
    date: { type: Date, required: true },
  },
  setup(props) {
    const { date } = toRefs(props);
    const isWeekend = ref(false);
    const formatDateDay = (date: Date) => {
      return format(date, "dd");
    };

    const formatDateMonth = (date: Date) => {
      return format(date, "MMMM");
    };

    const formatDateWeekDay = (date: Date) => {
      return format(date, "EEEE");
    };

    watch(date, () => (isWeekend.value = isWeekendCheck(date.value)), {
      immediate: true,
    });
    return { formatDateWeekDay, formatDateDay, formatDateMonth, isWeekend };
  },
});
</script>

<template>
  <th :class="{ daycell: true, weekend: isWeekend }">
    <div class="top">{{ formatDateWeekDay(date) }}</div>
    <div class="big">{{ formatDateDay(date) }}</div>
    <div class="bottom">{{ formatDateMonth(date) }}</div>
  </th>
</template>

<style lang="scss">
.daycell.weekend {
  background-color: var(--background-subdued);
  color: var(--foreground-subdued);
}

.daycell {
  background-color: var(--background-normal);
  color: var(--foreground-normal);
  font-size: 12px;
  padding: 12px;
  line-height: 12px;
  border-radius: 4px;
  overflow: hidden;
  min-width: 80px;
  max-width: 80px;
  .big {
    font-size: 26px;
    line-height: 26px;
    font-weight: 100;
    border-radius: 4px;
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
