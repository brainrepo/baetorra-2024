<template>
    <v-availability-timeline  :timetable="timetable" :services="services" />
</template>

<script>
import Timeline from "./components/timeline.vue";
export default {
  inheritAttrs: false,
  components: { "v-availability-timeline": Timeline },
  props: {
    timetable: {
      type: Object
    },
    services: {
      type: Array
    }
  },
};
</script>
