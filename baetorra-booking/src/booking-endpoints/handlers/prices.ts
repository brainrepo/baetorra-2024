import type { Response } from "express";
import { getUserId } from "../../shared/endpoints/user";
import { validateRequest } from "../invariants/booking-request";
import Repository from "../services/repository";
import { Request, VariantPrice } from "../types";
import { calculatePrice } from "../lib/price";
import { format } from "date-fns";

const AVAILABILITY_ERROR = "availability_error" as const;
const PRICE_ERROR = "price_error" as const;
const SECURITY_ERROR = "security_error" as const;
const VALIDATION_ERROR = "validation_error" as const;
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
  prices: Record<string, VariantPrice>;
  code: typeof SUCCESS;
};

export default (ItemsService: any) =>
  async (req: any, res: Response<ErrorResponse | SuccessResponse>) => {
    const repository = Repository(req.schema, ItemsService);
    const serviceId = req.params?.serviceId;
    const userId = getUserId(req) ?? null;
    const date: string = req.body.date ?? format(new Date(), "yyyy-MM-dd");

    if (!userId) {
      res.send({ status: "error", code: SECURITY_ERROR });
      return;
    }

    const service = await repository.getSellableServiceInfo(serviceId, userId);
    const shift: string = req.body.shift ?? service.shifts[0].id;

    const request: Request = {
      date,
      shift,
      service: service.id,
      seller: userId,
      variants: service.variants.reduce(
        (acc: Record<string, number>, v: { id: string }) => ({
          ...acc,
          [v.id]: 1,
        }),
        {}
      ),
    };

    console.log("request", request);

    if (!validateRequest(request, service, userId)) {
      res.send({ status: "error", code: VALIDATION_ERROR });
      return;
    }

    const prices = await calculatePrice(
      request,
      userId,
      repository.getPricesByVariantSellerShift
    );

    console.log("prices", prices);

    res.send({ status: "success", prices, code: SUCCESS });
  };
