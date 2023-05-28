import { getUserId } from "../../shared/endpoints/user";
import { Request, Service } from "./types";
import {
  getOverlappingDaysInIntervals,
  parse,
  set,
  differenceInDays,
} from "date-fns";
import _ from "lodash";

export default (ItemsService) => async (req, res) => {
  const serviceId = req.params?.serviceId;
  const userId = getUserId(req) ?? null;
  const request: Request = req.body;
  const service = await getServiceFromServiceId(
    serviceId,
    userId,
    ItemsService,
    req.schema
  );

  if (!validateRequest(request, service, userId)) {
    res.send({ error: "request not valid" });
    return;
  }

  let lockers: Record<string, number> = {};
  let prices: Record<
    string,
    | {
        type: "price";
        amount: number;
        value: number;
        fees: number;
        total: number;
      }
    | { type: "error"; message: string }
  > = {};

  const requestedVariant = removeZeroValProps(request.variants);

  for (const vk in requestedVariant) {
    const p = await getPricesByVariantSellerShift(
      vk,
      userId,
      request.shift,
      request.date,
      ItemsService,
      req.schema
    );

    const price = p?.[0];
    if (!price) {
      prices[vk] = { type: "error", message: "no price available" };
    } else {
      prices[vk] = {
        amount: requestedVariant[vk]!,
        type: "price",
        value: price.price,
        fees: price.fee,
        total: (price.price + price.fee) * requestedVariant[vk]!,
      };
    }

    const variantLockers = await getResourcesLockerFromVariantRequest(
      vk,
      requestedVariant[vk]!,
      ItemsService,
      req.schema
    );

    Object.keys(variantLockers).forEach((key) => {
      lockers[key] = (lockers?.[key] ?? 0) + variantLockers[key];
    });
  }

  // populate lockers with old reservations lockers
  for (const lockerK in lockers) {
    await warmupLockers(
      lockers,
      lockerK,
      request.shift,
      request.date,
      ItemsService,
      req.schema
    );
  }

  console.log("lockers----", lockers);

  const availabilities = await getAvailabilityFromResource(
    Object.keys(lockers),
    request.shift,
    request.date,
    ItemsService,
    req.schema
  );

  console.log("availabilities", availabilities);

  for (const lockerK in lockers) {
    if ((availabilities?.[lockerK] ?? 0) - lockers[lockerK]! < 0) {
      res.send({ prices, error: { code: "NO AVAILABILITY" } });
      return;
    }
  }

  res.send({ prices, availability: { code: "OK" } });
};

async function getAvailabilityFromResource(
  resourceIds: string[],
  shiftId: string,
  date: string,
  ItemsService: any,
  schema: any
) {
  const availabilityService = new ItemsService("availability", {
    schema,
    accountability: { admin: true, app: true },
  });

  const availabilities = await availabilityService.readByQuery({
    sort: ["id"],
    fields: ["resource", "amount"],
    filter: {
      resource: { _in: resourceIds },
      date: { _eq: date },
      shift: { _eq: shiftId },
    },
  });

  return _.chain(availabilities).keyBy("resource").mapValues("amount").value();
}

export async function getServiceFromServiceId(
  serviceId: string,
  userId: string,
  ItemsService: any, //directus doesn't export the type
  schema: any
): Promise<Service | undefined> {
  if (!serviceId || serviceId === "undefined") {
    return undefined;
  }
  const serviceService = new ItemsService("service", {
    schema,
    accountability: { admin: true, app: true },
  });

  const services = await serviceService.readByQuery({
    sort: ["name"],
    fields: [
      "*",
      "sellers.directus_users_id",
      "variants.id",
      "variants.name",
      "shifts.id",
      "shifts.name",
    ],
    filter: {
      sellers: { directus_users_id: { _eq: userId } },
      id: { _eq: serviceId },
    },
  });

  return services?.[0];
}

export async function getPricesByVariantSellerShift(
  variant: string,
  seller: string,
  shift: any,
  date: string,
  ItemsService: any, //directus doesn't export the type
  schema: any
): Promise<Service | undefined> {
  const priceService = new ItemsService("price", {
    schema,
    accountability: { admin: true, app: true },
  });

  const prices = await priceService.readByQuery({
    fields: ["*.*.*"],
    filter: {
      variant: { id: { _eq: variant } },
      shift: {
        id: { _eq: shift },
      },
      sellers: {
        directus_users_id: { _eq: seller },
      },
    },
  });

  //TODO: move it to the query
  return prices.filter((price: any) => {
    return dateOverlap(price.from, price.to, date, date);
  });
}

async function getResourcesLockerFromVariantRequest(
  variantId: string,
  requestedAmount: number,
  ItemsService: any,
  schema: any
) {
  const variantResourceService = new ItemsService("variant_resource", {
    schema,
    accountability: { admin: true, app: true },
  });

  const resourcesWithAmounts = await variantResourceService.readByQuery({
    sort: ["id"],
    fields: ["resource.id", "amount"],
    filter: {
      variant: { id: { _eq: variantId } },
    },
  });

  const lockers = resourcesWithAmounts.reduce((acc: any, e: any) => {
    acc[e.resource.id] = (acc[e.resource.id] ?? 0) + e.amount * requestedAmount;
    return acc;
  }, {});

  return lockers;
}

// Load the lockers from already active reservations
async function warmupLockers(
  lockers: Record<string, number> = {},
  resourceId: string,
  shiftId: string,
  date: string,
  ItemsService: any,
  schema: any
) {
  const LockersService = new ItemsService("resource_locker", {
    schema,
    accountability: { admin: true, app: true },
  });

  const bookedLockers = await LockersService.readByQuery({
    sort: ["id"],
    fields: ["amount", "resource"],
    filter: {
      resource: { id: { _eq: resourceId } },
      date: { _eq: date },
      shift: { _eq: shiftId },
      status: { _eq: true },
    },
  });

  bookedLockers.forEach(
    (bookedLocker: { resource: string; amount: number }) => {
      console.log("update lockers ", lockers[bookedLocker.resource]);
      lockers[bookedLocker.resource] =
        (lockers?.[bookedLocker.resource] ?? 0) + bookedLocker.amount;
      console.log("update lockers fine", lockers[bookedLocker.resource]);
    }
  );
}

export function validateRequest(
  request: Request,
  service: Service | undefined,
  seller: string
): boolean {
  if (!service) return false;
  if (!requestedDateIsGreaterEqualsToday(request)) return false;
  if (!isThereShift(request)) return false;
  if (!isThereAtLeastOneVariant(request)) return false;
  if (!areTheVariantsCorrect(request, service)) return false;
  if (!canISell(request, service, seller)) return false;
  return true;
}

function isThereShift(request: Request) {
  if (!request?.shift) return false;
  return true;
}

function canISell(request: Request, service: Service, seller: string) {
  if (request.seller !== seller) return false;

  return service.sellers.map((s) => s.directus_users_id).includes(seller);
}

function isThereAtLeastOneVariant(request: Request) {
  return Object.values(request?.variants)?.length > 0;
}

function areTheVariantsCorrect(request: Request, service: Service) {
  const requestedVariants = new Set(Object.keys(request.variants));
  const serviceVariants = new Set(service.variants.map((e) => e.id));
  return areSetsEqual(requestedVariants, serviceVariants);
}

function requestedDateIsGreaterEqualsToday(request: Request) {
  const diffDay = differenceInDays(
    parse(request?.date, "yyyy-MM-dd", new Date()),
    new Date()
  );

  if (diffDay < 0) return false;
  return true;
}

function areSetsEqual<K>(a: Set<K>, b: Set<K>) {
  return a.size === b.size && [...a].every((value) => b.has(value));
}

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

// Date utils
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
