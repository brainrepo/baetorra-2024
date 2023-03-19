import { computed, ref, toRefs } from "vue";
import LayoutComponent from "./layout.vue";
import { defineLayout } from "@directus/shared/utils";
import { useCollection, useItems } from "@directus/extensions-sdk";
import { generateTimetable } from "./utils/timetable";

export default defineLayout({
  id: "supplier-availability-timeline",
  name: "Supplier availability timeline",
  icon: "calendar_month",
  component: LayoutComponent,
  slots: {
    options: () => null,
    sidebar: () => null,
    actions: () => null,
  },
  setup(props) {
    const name = ref("supplier-price-timeline");
    const { collection, filter, search } = toRefs(props);

    const { primaryKeyField } = useCollection(collection);

    const queryFields = computed(() => {
      return [
        "id",
        "date",
        "amount",
        "name",
        "service.id",
        "shift.id",
        "shift.name",
        "resource.id",
        "resource.name",
        "service.name",
        "color",
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

    const { items: services } = useItems(ref("service"), {
      sort: computed(() => ["name"]),
      page: ref(1),
      limit: ref(10000),
      fields: [
        "id",
        "name",
        "resources.id",
        "resources.name",
        "shifts.id",
        "shifts.name",
      ],
      filter,
      search: search,
    });

    const timetable = computed(() => generateTimetable(items.value));

    return { name, collection, filter, search, items, timetable, services };
  },
});
