import _ from "lodash";
import { Price, Service } from "../types";
import { dateOverlap } from "../../shared/date";

type ServiceInfo = any;

const Repository = (
  schema: any,
  ItemsService: any
): {
  getSellableServices(userId: string): Promise<Service[]>;
  getSellableServiceInfo(
    serviceId: string,
    userId: string
  ): Promise<ServiceInfo>;
  getAvailabilityFromResources(
    resourceIds: string[],
    shiftId: string,
    date: string
  ): Promise<Record<string, number>>;
  getPricesByVariantSellerShift(
    variantId: string,
    sellerId: string,
    shiftId: string,
    date: string
  ): Promise<Price[]>;
  getResourcesLockerFromVariantRequest(
    variantId: string,
    requestedAmount: number
  ): Promise<Record<string, number>>;
} => {
  const accountability = { admin: true, app: true };

  const serviceService = new ItemsService("service", {
    schema,
    accountability,
  });

  return {
    async getSellableServices(userId) {
      return await serviceService.readByQuery({
        sort: ["name"],
        fields: ["*", "sellers.directus_users_id", "cover.*"],
        filter: { sellers: { directus_users_id: { _eq: userId } } },
      });
    },

    async getSellableServiceInfo(serviceId, userId) {
      let services;
      try {
        services = await serviceService.readByQuery({
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
            id: { _eq: serviceId },
            sellers: { directus_users_id: { _eq: userId } },
          },
        });
      } catch (e) {
        return undefined;
      }
      if (!services.length) {
        return undefined;
      }

      return services?.[0];
    },

    async getAvailabilityFromResources(resourceIds, shiftId, date) {
      const availabilityService = new ItemsService("availability", {
        schema,
        accountability: { admin: true, app: true },
      });

      const availabilities = await availabilityService.readByQuery({
        sort: ["id"],
        fields: ["resource", "amount"],
        filter: {
          resource: { _in: resourceIds },
          date: { _eq: date },
          shift: { _eq: shiftId },
        },
      });

      return _.chain(availabilities)
        .keyBy("resource")
        .mapValues("amount")
        .value();
    },

    async getPricesByVariantSellerShift(variantId, sellerId, shiftId, date) {
      const priceService = new ItemsService("price", {
        schema,
        accountability: { admin: true, app: true },
      });

      const prices = await priceService.readByQuery({
        fields: ["price", "fee", "from", "to"],
        filter: {
          variant: { id: { _eq: variantId } },
          shift: {
            id: { _eq: shiftId },
          },
          sellers: {
            directus_users_id: { _eq: sellerId },
          },
        },
      });

      console.log(prices);
      //TODO: move it to the query
      return prices.filter((price: any) => {
        return dateOverlap(price.from, price.to, date, date);
      });
    },

    async getResourcesLockerFromVariantRequest(
      variantId: string,
      requestedAmount: number
    ) {
      const variantResourceService = new ItemsService("variant_resource", {
        schema,
        accountability: { admin: true, app: true },
      });

      const resourcesWithAmounts = await variantResourceService.readByQuery({
        sort: ["id"],
        fields: ["resource.id", "amount"],
        filter: {
          variant: { id: { _eq: variantId } },
        },
      });

      const lockers = resourcesWithAmounts.reduce((acc: any, e: any) => {
        acc[e.resource.id] =
          (acc[e.resource.id] ?? 0) + e.amount * requestedAmount;
        return acc;
      }, {});

      return lockers;
    },
  };
};

export type RepositoryT = ReturnType<typeof Repository>;
export default Repository;
