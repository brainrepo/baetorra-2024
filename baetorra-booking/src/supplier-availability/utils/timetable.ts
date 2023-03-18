import { parseDateStart } from "../../supplier-prices/utils/utils";
import { formatDate } from "./utils";

type Items = Array<{
  date: string;
  id: string;
  shift: {
    id: string;
    name: string;
  };
  service: {
    id: string;
    name: string;
  };
  resource: {
    id: string;
    name: string;
  };
  amount: number;
}>;

type TimetableService = {
  id: string;
  name: string;
  resource: Record<string, TimetableResource>;
};

type TimetableResource = {
  id: string;
  name: string;
  dates: Record<string, Record<string, { id: string; amount: number }>>;
};

export function generateTimetable(items: Items) {
  const timetable: Record<string, TimetableService> = {};
  let minDate = formatDate(new Date());
  let maxDate = formatDate(new Date());

  for (const item of items) {
    if (timetable?.[item.service.id] === undefined) {
      timetable[item.service.id] = { ...item.service, resource: {} };
    }

    if (timetable[item.service.id].resource?.[item.resource.id] === undefined) {
      timetable[item.service.id].resource[item.resource.id] = {
        ...item.resource,
        dates: {},
      };
    }

    if (
      timetable[item.service.id].resource[item.resource.id]?.dates[
        item.date
      ] === undefined
    ) {
      timetable[item.service.id].resource[item.resource.id].dates[item.date] =
        {};
    }

    if (
      timetable[item.service.id].resource[item.resource.id].dates[item.date]?.[
        item.shift.id
      ] === undefined
    ) {
      timetable[item.service.id].resource[item.resource.id].dates[item.date][
        item.shift.id
      ] = { id: item.id, amount: item.amount };
    }

    if (parseDateStart(item.date) < parseDateStart(minDate)) {
      minDate = item.date;
    }

    if (parseDateStart(item.date) > parseDateStart(maxDate)) {
      maxDate = item.date;
    }
  }

  return { timetable, minDate, maxDate };
}
