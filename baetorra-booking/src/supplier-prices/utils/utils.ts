import {
  differenceInCalendarDays,
  getOverlappingDaysInIntervals,
  parse,
  set,
  addDays,
  format,
} from "date-fns";

export const getUserId = (req) => {
  return req?.accountability?.user || false;
};

export const removeZeroValProps = (
  obj: Record<string, number>
): Record<string, number> => {
  return Object.keys(obj).reduce((acc, e: string) => {
    if (obj[e] !== 0) {
      return { ...acc, [e]: obj[e] };
    }
    return acc;
  }, {});
};

export const parseDate = (date: string) =>
  parse(date, "yyyy-MM-dd", new Date());
export const parseDateStart = (date: string) =>
  set(parse(date, "yyyy-MM-dd", new Date()), {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
export const parseDateEnd = (date: string) =>
  set(parse(date, "yyyy-MM-dd", new Date()), {
    hours: 23,
    minutes: 59,
    seconds: 59,
    milliseconds: 999,
  });
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

export const numDays = (from: string, to: string) => {
  return differenceInCalendarDays(parseDateStart(from), parseDateEnd(to));
};

export const addDay = (from: string, amount: number) => {
  return addDays(parseDateStart(from), amount);
};

export const formatDate = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};
