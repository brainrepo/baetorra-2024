import { getUserId } from "../../shared/endpoints/user";
import Repository from "../services/repository";

export default (ItemsService: any) => async (req: any, res: any) => {
  const serviceId = req.params?.serviceId;
  const userId = getUserId(req) ?? null;

  if (!userId) {
    res.send({ status: "error", code: "401" });
    return;
  }

  const repository = Repository(req.schema, ItemsService);
  const service = await repository.getSellableServiceInfo(serviceId, userId);

  res.send(service);
};
