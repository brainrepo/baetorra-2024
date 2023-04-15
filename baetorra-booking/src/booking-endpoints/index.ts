import { defineEndpoint } from "@directus/extensions-sdk";
import bookingServices from "./booking/services";
import bookingService from "./booking/service";
import bookingQuote from "./booking/quote";

export default defineEndpoint((router, { services, emitter }) => {
  const { ItemsService } = services;

  router.get("/services", bookingServices(ItemsService, emitter));

  router.get("/services/:serviceId", bookingService(ItemsService));

  router.post("/services/:serviceId/quote", bookingQuote(ItemsService));
});
