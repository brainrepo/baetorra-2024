import { reduce } from "lodash";
import { computed, ref, toRefs, watch } from "vue";
import LayoutComponent from "./layout.vue";
import { defineLayout } from "@directus/shared/utils";
import { useCollection, useItems } from "@directus/extensions-sdk";
import { generateTimetable } from "./utils/timetable";

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
        "sellers.directus_users_id.id",
        "service.name",
        "variant.id",
        "service.id",
        "variant.name",
        "service.name",
        "price",
        "fee",
        "status",
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

    const timetable = ref();

    watch(
      items,
      (data) => {
        console.log("generate timetable");
        timetable.value = generateTimetable(data);
      },
      {
        immediate: true,
      }
    );

    return { name, collection, filter, search, items, timetable };
  },
});
