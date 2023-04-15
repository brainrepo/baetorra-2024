<script lang="ts">
import { defineComponent, ref, watch, toRefs, computed } from "vue";
import { useApi, useStores } from "@directus/extensions-sdk";
import debounce from "lodash.debounce";
import {Locker} from "../types"

export default defineComponent({
  name: "v-availabilitycell",
  props: {
    id: { type: String, required: false },
    amount: { type: Number, required: true },
    shift: { type: Object, required: true },
    scheleton: { type: Object, required: true },
    lockers: { type: Array, required: false },
  },
  setup: (props) => {
    const api = useApi();
    const loading = ref(false);
    const isFocus = ref(false);
    const { id, amount, scheleton, lockers } = toRefs(props);
    const reserved = computed(() => 
      lockers.value?.reduce((acc: number, locker:Locker) => acc + locker.amount, 0) as Number ?? 0 
    )

    const reservedTemp = computed(() => {
      const temp = (reserved.value / amount.value)

      if(temp < .5) {
        return "green"
      }

      if(temp < 1) {
        return "orange"
      }

      if(temp >= 1) {
        return "red"
      }

      return ""
    })



    const setFocus = (focus: boolean) => {
      isFocus.value = focus;
    };

    const setAvailability = () => {
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
    };
    watch(amount, debounce(setAvailability, 400) as () => void);

    return { loading, amount, id, setFocus, isFocus, reserved, reservedTemp };
  },
});
</script>

<template>
  <div :class="{ availability: true, 'not-created': !id, focus: isFocus }">
    <div :class="`shift ${reservedTemp}`">
      {{ shift.name }}
    </div>
    <label v-if="!loading">
      <span class="big" v-if="id" :data-id="JSON.stringify(id)"
        >{{ reserved }}/</span
      >
      <span
        ><input
          type="number"
          :style="{ width: '30px' }"
          v-model="amount"
          @focusin="setFocus(true)"
          @focusout="setFocus(false)"
      /></span>
    </label>
    <v-icon
      v-if="loading"
      name="cached"
      small
      :filled="false"
      class="rotating"
    ></v-icon>
  </div>
</template>

<style lang="scss" scoped="true">
.availability {
  width: 100%;
  color: var(--foreground-normal);
  font-size: 12px;
  line-height: 12px;
  overflow: hidden;
  min-width: 80px;
  text-align: center;
  flex-shrink: 0;
  border-radius: 4px;
  border: 2px solid var(--border-normal);
  margin-bottom: 3px;
  &.focus {
    border: 2px solid var(--primary);
  }
  &.not-created {
    opacity: 0.6;
  }
  label {
    text-align: center;
    justify-items: end;
    align-items: center;
    width: 100%;
    .big {
      font-size: 14px;
      line-height: 14px;
      border-radius: 4px;
      font-family: var(--family-monospace);
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
    &.red{
      background-color: var(--red);
    }
    &.green{
      background-color: var(--green);
    }
    &.orange{
      background-color: var(--orange);
    }
  }
  input {
    border: 0;
    background-color: transparent;
    font-size: 14px;
    border-radius: 3px;
    font-family: var(--family-monospace);
  }
  input:focus {
    color: var(--primary);
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
