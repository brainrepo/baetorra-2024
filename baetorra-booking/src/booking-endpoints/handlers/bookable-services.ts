import { getUserId } from "../../shared/endpoints/user";
import Repository from "../services/repository";

export default (ItemsService: any, emitter: any) =>
  async (req: any, res: any) => {
    const repository = Repository(req.schema, ItemsService);
    const userId = getUserId(req) ?? null;

    if (!userId) {
      res.send({ status: "error", code: "401" });
      return;
    }

    const service = await repository.getSellableServices(userId);

    emitter.emitAction("baetorra-booking-get-services");

    res.send(service);
  };
