import type { Response } from "express";
import { getUserId } from "../../shared/endpoints/user";
import { validateRequest } from "../invariants/booking-request";
import Repository from "../services/repository";
import { BookingRequest, Request, VariantPrice } from "../types";
import _ from "lodash";
import { calculateAvailability } from "../lib/availability";
import { calculatePrice } from "../lib/price";

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
  code: typeof SUCCESS;
  id: string;
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

    const request: BookingRequest = req.body;
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

      // Booking

      const id = await repository.saveReservation({
        customerName: request.customerName,
        customerEmail: request.customerEmail,
        customerPhone: request.customerPhone,
        shift: request.shift,
        service: serviceId,
        seller: userId,
        bookedDate: request.date,
        prices,
        lockers: lockers.map((l) => ({
          ...l,
          status: true,
        })),
      });

      console.log("book", {
        customerName: request.customerName,
        customerEmail: request.customerEmail,
        customerPhone: request.customerPhone,
        shift: request.shift,
        service: serviceId,
        seller: userId,
        bookedDate: request.date,
        reservation: JSON.stringify(prices),
        lockers: lockers.map((l) => ({
          ...l,
          status: true,
        })),
      });

      res.send({ status: "success", id, code: SUCCESS });
    } catch (e) {
      res.send({ status: "error", prices: prices, code: AVAILABILITY_ERROR });
    }
  };
