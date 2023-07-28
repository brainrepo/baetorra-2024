import type { Response } from "express";
import { getUserId } from "../../shared/endpoints/user";
import Repository from "../services/repository";
import _ from "lodash";

const SECURITY_ERROR = "security_error" as const;
type ErrorResponse = {
  status: string;
  code: string;
  error: Error | null;
};
type SuccessResponse = {
  reservationId: string;
  status: "success";
};

export default (ItemsService: any) =>
  async (req: any, res: Response<ErrorResponse | SuccessResponse>) => {
    const repository = Repository(req.schema, ItemsService);
    const reservationId = req.params?.reservationId;
    const userId = getUserId(req) ?? null;

    if (!userId) {
      res.send({ status: "error", code: SECURITY_ERROR, error: null });
      return;
    }

    const [resp, error] = await repository.voidReservation(
      reservationId,
      userId
    );

    if (!resp) {
      res.send({
        code: "VOIDING_ERROR",
        status: "error",
        error,
      });
      return;
    }

    res.send({
      reservationId,
      status: "success",
    });
  };
