import { addDay, formatDate, numDays } from "./utils";

type Items = Array<{
  from: string;
  to: string;
  id: string;
  name: string;
  sellers: {
    directus_users_id: {
      id: string;
      first_name: string;
      last_name: string;
    };
    id: number;
  }[];
  service: {
    id: string;
    name: string;
  };
  variant: {
    id: string;
    name: string;
  };
  price: number;
  fee: number;
}>;

type TimetableService = {
  id: string;
  name: string;
  sellers: Record<number, TimetableSeller>;
};

type TimetableSeller = {
  id: number;
  name: string;
  variants: Record<string, TimetableVariant>;
};

type TimetableVariant = {
  id: string;
  name: string;
  prices: Record<string, TimetablePrice>;
};

type TimetablePrice = {
  id: string; // link al record di tariffa
  price: number;
  fee: number;
  status: boolean;
  date: Date;
};

export function generateTimetable(items: Items) {
  const timetable: Record<string, TimetableService> = {};
  let minDate = formatDate(new Date());
  let maxDate = formatDate(new Date());

  for (const item of items) {
    if (timetable?.[item.service.id] === undefined) {
      timetable[item.service.id] = { ...item.service, sellers: {} };
    }

    for (const seller of item.sellers) {
      if (
        timetable[item.service.id].sellers?.[seller.directus_users_id.id] ===
        undefined
      ) {
        timetable[item.service.id].sellers[seller.directus_users_id.id] = {
          id: seller.id,
          name: `${seller.directus_users_id.first_name || ""} ${
            seller.directus_users_id.last_name || ""
          }`,
          variants: {},
        };
      }

      if (
        timetable[item.service.id].sellers[seller.directus_users_id.id]
          .variants?.[item.variant.id] === undefined
      ) {
        timetable[item.service.id].sellers[
          seller.directus_users_id.id
        ].variants[item.variant.id] = {
          ...item.variant,
          prices: {},
        };
      }

      const dateDiff = numDays(item.to, item.from);

      if (numDays(item.from, minDate) < 0) {
        minDate = item.from;
      }
      if (numDays(item.to, maxDate) > 0) {
        maxDate = item.to;
      }

      for (let i = 0; i < dateDiff; i++) {
        const day = addDay(item.from, i);

        timetable[item.service.id].sellers[
          seller.directus_users_id.id
        ].variants[item.variant.id].prices = {
          ...timetable[item.service.id].sellers[seller.directus_users_id.id]
            .variants[item.variant.id].prices,
          [formatDate(day)]: {
            id: item.id,
            price: item.price,
            fee: item.fee,
            date: day,
          },
        };
      }
    }
  }

  return { timetable, minDate, maxDate };
}
