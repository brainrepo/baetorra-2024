<script lang="ts">
import { useApi, useItems, useStores } from "@directus/extensions-sdk";
import { defineComponent, ref, Ref } from "vue";
export default defineComponent({
  name: "Sidebar",
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

<template>
  <v-list dense="false">
    <v-list-item v-for="(item, index) in items"  clickable :to="`/booking-module/quote/${item.id}`">
      <v-image :src="'/assets/'+item.cover?.id+'?fit=cover&width=40&height=40&quality=80'" />

      <span class="spacing-l">{{ item?.name }}</span>
    </v-list-item>
  </v-list>
</template>
<style scoped>
.spacing-l{
  margin-left:3px;
}
</style>