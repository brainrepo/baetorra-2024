import { reduce } from "lodash";
import { computed, ref, toRefs, watch } from "vue";
import LayoutComponent from "./layout.vue";
import { defineLayout } from "@directus/shared/utils";
import { useCollection, useItems } from "@directus/extensions-sdk";

export default defineLayout({
  id: "custom",
  name: "Custom",
  icon: "box",
  component: LayoutComponent,
  slots: {
    options: () => null,
    sidebar: () => null,
    actions: () => null,
  },
  setup(props, { emit }) {
    const name = ref("Custom Layout");
    const { collection, filter, search } = toRefs(props);

    const { primaryKeyField, fields: fieldsInCollection } =
      useCollection(collection);

    const queryFields = computed(() => {
      return [
        "id",
        "from",
        "to",
        "name",
        "variant",
        "sellers.id",
        "sellers.directus_users_id.first_name",
        "sellers.directus_users_id.last_name",
        "service",
        "variant.id",
        "service.id",
        "variant.name",
        "service.name",
      ];
    });

    const { items } = useItems(collection, {
      sort: computed(() => [primaryKeyField.value?.field || ""]),
      page: ref(1),
      limit: ref(10000),
      fields: queryFields,
      filter,
      search: search,
    });

    console.log(filter.value, search.value);

    const { items: services } = useItems(ref("service"), {
      sort: ref("id"),
      page: ref(1),
      limit: ref(10000),
      fields: ref([
        "id",
        "name",
        "variants.id",
        "variants.name",
        "sellers.directus_users_id.first_name",
        "sellers.directus_users_id.last_name",
        "sellers.directus_users_id.id_name",
      ]),
      filter: ref({ status: { _neq: "archived" } }),
      search: ref({}),
    });

    console.log(services.value);

    return { name, collection, filter, search, items, services };
  },
});
