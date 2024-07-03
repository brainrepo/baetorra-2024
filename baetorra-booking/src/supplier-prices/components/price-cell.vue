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
  <a :href="`/admin/content/price/${price.id}`" class="price">
    <div class="shift" :style="{backgroundColor: price.color}">
      {{ price.shiftName }}
    </div>
    <div class="price-info">
      <div class="big">{{formatNum(price.price) }}</div>
      <div class="bottom">
        {{ formatNum(price.fee)  }}
      </div>
    </div>
    
    
  </a>
</template>

<style lang="scss" scoped="true">
.price {
  display: block;
  background-color: var(--background-normal);
  color: var(--foreground-normal);
  font-size: 12px;
  line-height: 12px;
  border-radius: 4px;
  overflow: hidden;
  min-width: 80px;
  max-width: 80px;
  text-align: center;
  flex-shrink: 0;
  &:not(:last-child){
    margin-right: 4px;
  }
  .price-info{
    padding: 4px;
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
  

  .shift {
    background-color: var(--background-inverted);
    color: var(--foreground-inverted);
    font-size: 8px;
    text-transform: uppercase;
    font-weight: 600;
  }
}
</style>
