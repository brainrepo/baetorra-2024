import { reduce } from "lodash";
import { computed, ref, toRefs, watch } from "vue";
import LayoutComponent from "./layout.vue";
import { defineLayout } from "@directus/shared/utils";
import { useCollection, useItems } from "@directus/extensions-sdk";
import { generateTimetable } from "./utils/timetable";

export default defineLayout({
  id: "supplier-price-timeline",
  name: "Supplier price timeline",
  icon: "calendar_month",
  component: LayoutComponent,
  slots: {
    options: () => null,
    sidebar: () => null,
    actions: () => null,
  },
  setup(props, { emit }) {
    const name = ref("supplier-price-timeline");
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
        "shift.name",
        "variant.name",
        "service.name",
        "price",
        "fee",
        "status",
        "color",
      ];
    });

    const { items } = useItems(collection, {
      sort: computed(() => [primaryKeyField.value?.field || ""]),
      page: ref(1),
      limit: ref(10000000),
      fields: queryFields,
      filter,
      search: search,
    });

    const timetable = ref();

    watch(
      items,
      (data) => {
        timetable.value = generateTimetable(data);
      },
      {
        immediate: true,
      }
    );

    return { name, collection, filter, search, items, timetable };
  },
});
