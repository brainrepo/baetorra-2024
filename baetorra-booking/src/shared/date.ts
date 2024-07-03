import {
  addDays,
  differenceInCalendarDays,
  parse,
  set,
  format,
  getOverlappingDaysInIntervals,
  differenceInDays,
} from "date-fns";
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

export const formatDate = (date: Date) => {
  return format(date, DATE_FORMAT);
};

export const dateOverlap = (
  from1: string,
  to1: string,
  from2: string,
  to2: string
): boolean => {
  return (
    getOverlappingDaysInIntervals(
      { start: parseDateStart(from1), end: parseDateEnd(to1) },
      { start: parseDateStart(from2), end: parseDateEnd(to2) }
    ) > 0
  );
};

export const dateDiff = (date1: string, date2?: string) => {
  if (!date2) {
    date2 = format(new Date(), DATE_FORMAT);
  }
  return differenceInDays(
    parse(date1, "yyyy-MM-dd", new Date()),
    parse(date2, "yyyy-MM-dd", new Date())
  );
};
