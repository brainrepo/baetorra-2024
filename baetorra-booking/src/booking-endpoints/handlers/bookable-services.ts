import { getUserId } from "../../shared/endpoints/user";
import Repository from "../services/repository";

export default (ItemsService: any, emitter: any) =>
  async (req: any, res: any) => {
    const repository = Repository(req.schema, ItemsService);
    const userId = getUserId(req) ?? null;

    const service = await repository.getSellableServices(userId);
    console.log("service", service);

    emitter.emitAction("baetorra-booking-get-services");

    res.send(service);
  };
