import { getUserId } from "../../shared/endpoints/user";

export default (ItemsService, emitter) => async (req, res) => {
  const userId = getUserId(req) ?? null;

  const serviceService = new ItemsService("service", {
    schema: req.schema,
    accountability: { admin: true, app: true },
  });

  const services = await serviceService.readByQuery({
    sort: ["name"],
    fields: ["*", "sellers.directus_users_id", "cover.*"],
    filter: { sellers: { directus_users_id: { _eq: userId } } },
  });

  emitter.emitAction("baetorra-booking-get-services");

  res.send(services);
};
