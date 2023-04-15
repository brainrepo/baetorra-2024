<template>
  <private-view title="Booking" small-header="Small header">
    <template #sidebar>
      <layout-sidebar icon="info_outline" title="asdsadasdasda" close>
        <div>asdjaslkdjalskjdklasjdlkjaslk</div>
      </layout-sidebar>
    </template>
    <template #navigation>
      <Sidebar />
    </template>
    <div class="main-quote">
     
      <v-sheet  class="main-quote">
        <div v-for="(item, index) in items">
        <div>{{ item.name }}</div>
        <img :src="'/assets/'+item.cover?.filename_disk+'?fit=cover&width=300&height=200&quality=72'" />
      </div>
      </v-sheet>
      
    </div>

  </private-view>
</template>

<script lang="ts">
import { useApi, useItems, useStores } from "@directus/extensions-sdk";
import { defineComponent, ref, Ref } from "vue";
import Sidebar from '../components/Sidebar.vue'

export default defineComponent({
  components: {Sidebar},
  setup() {
    const items = ref<any>([])
    const collection: Ref<string | null> = ref("service");
   // const items = useItems(collection, { limit: 10, fields: ["name"] });
    const api = useApi()
    api.get('/booking-endpoints/services').then(e => {
      items.value = e.data
    }) 
    return { items };
   },
});
</script>
