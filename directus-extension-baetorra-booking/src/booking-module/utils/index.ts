import { format, addDays, differenceInDays, parse } from "date-fns";

// Sync with hooks
export interface Service {
  id: string;
  name: string;
  shifts: Shift[];
  variants: Variant[];
  seller_helper_notice: string;
  sellers: Seller[];
}

interface Seller {
  directus_users_id: string;
}

interface Shift {
  id: string;
  name: string;
}

interface Variant {
  id: string;
  name: string;
}

export interface Request {
  service: string;
  shift: string;
  date: string;
  variants: Record<string, number>;
  seller: string;
}

export function initializeRequestByService(
  service: Service,
  seller: string
): Request {
  return {
    variants: service.variants.reduce(
      (acc, { id }) => ({ ...acc, [id]: 0 }),
      {}
    ),
    shift: service.shifts[0]?.id,
    date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    seller,
  };
}

export function isServiceValid(service: Service) {
  if (!service.shifts.length) return false;
  if (!service.variants.length) return false;

  return true;
}

export function isRequestValid(request: Request) {
  if (!request?.shift) return false;
  if (!Object.values(request.variants).filter((e) => e > 0).length) {
    return false;
  }

  if (!request?.date) return false;

  const diffDay = differenceInDays(
    parse(request.date, "yyyy-MM-dd", new Date()),
    new Date()
  );

  if (diffDay < 0) return false;

  return true;
}
