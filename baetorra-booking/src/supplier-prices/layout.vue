<template>
  <div>
  {{ items }}
  --
  {{ services }}
    <v-gantt view-mode="day" minDate="2022-01-01" maxDate="2022-05-01" :data="{
    'Adulti': { '2022-01-01': { id: 1, value: 'pippo' } }, 'Bambini': {
    '2022-02-01': { id: 1, value: 'pippo' } } }" :services="services" />
  </div>
</template>

<script>
import Gantt from "./components/gant.vue";
export default {
  inheritAttrs: false,
  components: { "v-gantt": Gantt },
  props: {
    collection: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    filter: {
      type: Object,
      required: false,
    },
    search: {
      type: Object,
      required: false,
    },
    items: {
      type: Array,
      required: false,
    },
	services: {
      type: Array,
      required: false,
    },
  },
};
</script>
