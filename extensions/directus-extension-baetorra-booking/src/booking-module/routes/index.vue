<template>
  <private-view title="Booking" small-header="Small header">
    <div class="main-quote">
      Loading
    </div>
  </private-view>
</template>

<script lang="ts">
import { useApi } from "@directus/extensions-sdk";
import { defineComponent, ref, Ref } from "vue";
import Sidebar from '../components/Sidebar.vue'
import { useRouter, } from 'vue-router'

export default defineComponent({
  components: {Sidebar},
  setup() {
    const router = useRouter()
    const collection: Ref<string | null> = ref("service");
   // const items = useItems(collection, { limit: 10, fields: ["name"] });
    const api = useApi()
    api.get('/booking-endpoints/services').then(e => {
      if(e.data.length > 0) {
        router.push(`/booking-module/quote/${e.data[0].id}`)
      }
    }) 

   },
});
</script>
