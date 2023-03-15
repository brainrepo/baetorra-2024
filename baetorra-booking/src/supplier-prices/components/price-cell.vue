<script lang="ts">
import { defineComponent, ref, watch, toRefs } from "vue";
import { format, isWeekend as isWeekendCheck } from "date-fns";

export default defineComponent({
  name: "v-pricecell",
  props: {
    price: { type: Object, required: true },
  },
  setup: () => {
    const formatNum = (num) =>  new Intl.NumberFormat('it-IT', {style: 'currency', currency: 'EUR'}).format(num)
    return {formatNum}
  }
});
</script>

<template>
  <td>
    <div class="big">{{formatNum(price.price) }}</div>
    <div class="bottom">
      FEE:
      {{ formatNum(price.fee)  }}
    </div>
  </td>
</template>

<style lang="scss" scoped="true">
td {
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
    font-size: 14px;
    line-height: 14px;
    font-weight: 300;
    border-radius: 4px;
    font-family: var(--family-sans-serif);
  }
  .bottom {
    font-size: 9px;
    text-transform: uppercase;
  }
}
</style>
