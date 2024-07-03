<template>
  <div>
    <v-gantt  :timetable="timetable" />
  </div>
</template>

<script>
import Gantt from "./components/gant.vue";
export default {
  inheritAttrs: false,
  components: { "v-gantt": Gantt },
  props: {
    timetable: {
      type: Object
    }
  },
};
</script>
