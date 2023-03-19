import { extractMinMaxDate } from "../../shared/date";
import { Item } from "../types";
import { set } from "lodash";

export function generateTimetable(items: Item[]) {
  if (items === undefined || items.length === 0) return;

  const [min, max] = extractMinMaxDate<Item>(items, "date");

  let timetable = {};

  items.forEach((item) => {
    set(
      timetable,
      `${item.service.id}.resource.${item.resource.id}.dates.${item.date}.${item.shift.id}`,
      { id: item.id, amount: item.amount }
    );
  });

  return { timetable, minDate: min, maxDate: max };
}
