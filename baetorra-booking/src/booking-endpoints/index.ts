import { defineEndpoint } from "@directus/extensions-sdk";
import getBookableServices from "./handlers/bookable-services";
import getBookableService from "./handlers/bookable-service";
import bookingQuote from "./handlers/quote";

export default defineEndpoint(async (router, { services, emitter }) => {
  const { ItemsService } = services;

  router.get("/services", getBookableServices(ItemsService, emitter));

  router.get("/services/:serviceId", getBookableService(ItemsService));

  router.post("/services/:serviceId/quote", bookingQuote(ItemsService));
});
