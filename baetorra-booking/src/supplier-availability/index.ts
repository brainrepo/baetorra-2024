import { reduce } from "lodash";
import { computed, ref, toRefs, watch } from "vue";
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
  setup(props, { emit }) {
    const name = ref("supplier-price-timeline");
    const { collection, filter, search } = toRefs(props);

    const { primaryKeyField, fields: fieldsInCollection } =
      useCollection(collection);

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

    const timetable = ref();

    watch(
      items,
      (data) => {
        console.log(data);
        timetable.value = generateTimetable(data);
        //timetable.value = data;
        console.log("generate timetable", timetable.value);
      },
      {
        immediate: true,
      }
    );

    return { name, collection, filter, search, items, timetable };
  },
});
