import { extractMinMaxDate } from "../../shared/date";
import { Item, Locker } from "../types";
import { set } from "lodash";

export function generateTimetable(items: Item[], lockers: Locker[]) {
  console.log(lockers);
  if (items === undefined || items.length === 0) return;

  const [min, max] = extractMinMaxDate<Item>(items, "date");

  let timetable = {};

  items.forEach((item) => {
    set(
      timetable,
      `${item.service.id}.resource.${item.resource.id}.dates.${item.date}.${item.shift.id}`,
      {
        id: item.id,
        amount: item.amount,
        lockers: lockers?.filter((l) => l.availability === item.id),
      }
    );
  });

  console.log(timetable);

  return { timetable, minDate: min, maxDate: max };
}
