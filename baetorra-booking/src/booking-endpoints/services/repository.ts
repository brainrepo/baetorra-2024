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
  ): Promise<
    {
      id: string;
      resource: string;
      amount: number;
      lockers: Array<{ amount: number; status: boolean }>;
    }[]
  >;
  getPricesByVariantSellerShift(
    variantId: string,
    sellerId: string,
    shiftId: string,
    date: string
  ): Promise<Price[]>;
  getVariantResources(variantId: string): Promise<
    {
      resource: { id: string };
      amount: number;
    }[]
  >;
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

      return await availabilityService.readByQuery({
        sort: ["id"],
        fields: [
          "id",
          "resource",
          "amount",
          "lockers.amount",
          "lockers.status",
        ],
        filter: {
          resource: { _in: resourceIds },
          date: { _eq: date },
          shift: { _eq: shiftId },
        },
      });
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

      //TODO: move it to the query
      return prices.filter((price: any) => {
        return dateOverlap(price.from, price.to, date, date);
      });
    },

    async getVariantResources(variantId: string) {
      const variantResourceService = new ItemsService("variant_resource", {
        schema,
        accountability: { admin: true, app: true },
      });

      return await variantResourceService.readByQuery({
        sort: ["id"],
        fields: ["resource.id", "amount"],
        filter: {
          variant: { id: { _eq: variantId } },
        },
      });
    },
  };
};

export type RepositoryT = ReturnType<typeof Repository>;
export default Repository;
