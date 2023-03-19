import { addDays, differenceInCalendarDays, parse, set } from "date-fns";
import { minBy, maxBy } from "lodash";

const DATE_FORMAT = "yyyy-MM-dd";
const START_DAY = {
  hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
};
const END_DAY = {
  hours: 23,
  minutes: 59,
  seconds: 59,
  milliseconds: 999,
};

export const parseDateStart = (date: string) =>
  set(parse(date, DATE_FORMAT, new Date()), START_DAY);

export const parseDateEnd = (date: string) =>
  set(parse(date, DATE_FORMAT, new Date()), END_DAY);

export function extractMinMaxDate<T>(items: T[], propName: keyof T) {
  const min = minBy(items, (e: T) => parseDateStart(e[propName] as string));
  const max = maxBy(items, (e: T) => parseDateStart(e[propName] as string));

  return [min?.[propName], max?.[propName]];
}

export function getDaysBetween(from: string, to: string) {
  const days =
    differenceInCalendarDays(parseDateStart(to), parseDateEnd(from)) + 1;
  return Array(days)
    .fill("-")
    .map((_, i) => addDays(parseDateStart(from), i));
}
