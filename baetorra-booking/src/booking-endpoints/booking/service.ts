import { getUserId } from "../../shared/endpoints/user";

export default (ItemsService) => async (req, res) => {
  const serviceId = req.params?.serviceId;
  const userId = getUserId(req) ?? null;
  const serviceService = new ItemsService("service", {
    schema: req.schema,
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

  res.send(services);
};
