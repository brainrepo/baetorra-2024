import type { Response } from "express";
import { getUserId } from "../../shared/endpoints/user";
import { validateRequest } from "../invariants/booking-request";
import Repository from "../services/repository";
import { Request } from "../types";
import _ from "lodash";

const AVAILABILITY_ERROR = "availability error" as const;
const PRICE_ERROR = "price error" as const;
const SECURITY_ERROR = "security error" as const;
const VALIDATION_ERROR = "validation error" as const;
const SUCCESS = "success" as const;

type VariantPrice = {
  type: "price";
  amount: number;
  value: number;
  fees: number;
  total: number;
};

type ErrorResponse = {
  status: "error";
  prices?: Record<string, VariantPrice | undefined>;
  code:
    | typeof AVAILABILITY_ERROR
    | typeof PRICE_ERROR
    | typeof VALIDATION_ERROR
    | typeof SECURITY_ERROR;
};

type SuccessResponse = {
  status: "success";
  prices: Record<string, VariantPrice | undefined>;
  code: typeof SUCCESS;
};

export default (ItemsService: any) =>
  async (req: any, res: Response<ErrorResponse | SuccessResponse>) => {
    const repository = Repository(req.schema, ItemsService);
    const serviceId = req.params?.serviceId;
    const userId = getUserId(req) ?? null;

    if (!userId) {
      res.send({ status: "error", code: SECURITY_ERROR });
      return;
    }

    const request: Request = req.body;

    const service = await repository.getSellableServiceInfo(serviceId, userId);

    if (!validateRequest(request, service, userId)) {
      res.send({ status: "error", code: VALIDATION_ERROR });
      return;
    }

    let lockers: Record<string, number> = {};
    let prices: Record<string, VariantPrice | undefined> = {};

    const requestedVariant = _.pickBy(request.variants, (e) => e > 0);

    for (const vk in requestedVariant) {
      console.log("-", vk);
      const p = await repository.getPricesByVariantSellerShift(
        vk,
        userId,
        request.shift,
        request.date
      );

      const price = p?.[0];

      if (!price) {
        prices[vk] = undefined;
      } else {
        prices[vk] = {
          amount: requestedVariant[vk]!,
          type: "price",
          value: price.price,
          fees: price.fee,
          total: (price.price + price.fee) * requestedVariant[vk]!,
        };
      }

      const variantLockers =
        await repository.getResourcesLockerFromVariantRequest(
          vk,
          requestedVariant[vk]!
        );

      Object.keys(variantLockers).forEach((key) => {
        lockers[key] = (lockers?.[key] ?? 0) + variantLockers[key]!;
      });
    }

    if (Object.keys(_.pickBy(prices, (e) => typeof e === "undefined")).length) {
      res.send({ status: "error", prices: prices, code: PRICE_ERROR });
      return;
    }

    // TODO: move this logic to the
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

    const availabilities = await repository.getAvailabilityFromResources(
      Object.keys(lockers),
      request.shift,
      request.date
    );

    for (const lockerK in lockers) {
      //TODO: irrobustire qui per connettere i locker alle availability
      if ((availabilities?.[lockerK] ?? 0) - lockers[lockerK]! < 0) {
        res.send({ prices, code: AVAILABILITY_ERROR, status: "error" });
        return;
      }
    }

    res.send({ status: "success", prices, code: SUCCESS });
  };

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
