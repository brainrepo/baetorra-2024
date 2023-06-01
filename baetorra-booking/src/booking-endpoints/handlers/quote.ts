import type { Response } from "express";
import { getUserId } from "../../shared/endpoints/user";
import { validateRequest } from "../invariants/booking-request";
import Repository from "../services/repository";
import { Request, VariantPrice } from "../types";
import _ from "lodash";
import { calculateAvailability } from "../lib/availability";
import { calculatePrice } from "../lib/price";

const AVAILABILITY_ERROR = "availability error" as const;
const PRICE_ERROR = "price error" as const;
const SECURITY_ERROR = "security error" as const;
const VALIDATION_ERROR = "validation error" as const;
const SUCCESS = "success" as const;

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

    let prices = await calculatePrice(
      request,
      userId,
      repository.getPricesByVariantSellerShift
    );

    try {
      const lockers = await calculateAvailability(
        request,
        repository.getVariantResources,
        repository.getAvailabilityFromResources
      );

      console.log("lockers", lockers);

      if (
        Object.keys(
          _.pickBy(
            prices,
            (e) => typeof e === "undefined" || e.type === "error"
          )
        ).length
      ) {
        res.send({ status: "error", prices: prices, code: PRICE_ERROR });
        return;
      }

      res.send({ status: "success", prices, code: SUCCESS });
    } catch (e) {
      res.send({ status: "error", prices: prices, code: AVAILABILITY_ERROR });
    }
  };
