<script lang="ts">
import { defineComponent, ref, watch, toRefs } from "vue";
import { useApi, useStores } from "@directus/extensions-sdk";
import debounce from "lodash.debounce";

export default defineComponent({
  name: "v-availabilitycell",
  props: {
    id: { type: String, required: false },
    amount: { type: Number, required: true },
    shift: { type: Object, required: true },
    scheleton: { type: Object, required: true },
  },
  setup: (props) => {
    const api = useApi();
    const loading = ref(false);
    const { id, amount, scheleton } = toRefs(props);

    watch(
      amount,
      debounce(() => {
        loading.value = true;
        if (id.value) {
          api
            .patch(`items/availability/${id.value}`, {
              amount: amount.value,
            })
            .finally(() => (loading.value = false));
        } else {
          api
            .post(`items/availability`, {
              amount: amount.value,
              ...scheleton.value,
            })
            .then(({ data }) => {
              id.value = data.data.id;
            })
            .finally(() => (loading.value = false));
        }
      }, 400)
    );

    return { loading, amount, id };
  },
});
</script>

<template>
  <div :class="{ availability: true, 'not-created': !id }">
    <div class="shift">
      {{ shift.name }}
    </div>
    <div class="availability-info">
      <span class="big"> 0 / </span>
      <input v-if="!loading"
        small
        type="number"
        :style="{ width: '30px' }"
        v-model="amount"
      /><v-icon v-if="loading" name="cached" small :filled="false" class="rotating"></v-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped="true">
.availability {
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
  &:not(:last-child) {
    margin-right: 4px;
  }
  &.not-created {
    opacity: 0.6;
  }
  .availability-info {
    padding: 4px;
    .big {
      font-size: 14px;
      line-height: 14px;
      font-weight: bold;
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

@keyframes rotating {
  from {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.rotating {
  -webkit-animation: rotating 2s linear infinite;
  -moz-animation: rotating 2s linear infinite;
  -ms-animation: rotating 2s linear infinite;
  -o-animation: rotating 2s linear infinite;
  animation: rotating 2s linear infinite;
}
</style>
