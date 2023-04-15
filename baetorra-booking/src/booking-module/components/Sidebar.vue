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
  <v-list>
    <v-list-item v-for="(item, index) in items"  clickable :to="`/booking-module/quote/${item.id}`">
      <v-list-item-icon>
        <v-icon name="box" />
      </v-list-item-icon>
      {{ item?.name }}
    </v-list-item>
  </v-list>
</template>
