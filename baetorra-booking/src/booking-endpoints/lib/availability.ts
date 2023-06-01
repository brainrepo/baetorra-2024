import _ from "lodash";
import { RepositoryT } from "../services/repository";
import { Request } from "../types";
type ResourceId = string;
type GetVariantResources = RepositoryT["getVariantResources"];
type GetAvailabilityFromResources = RepositoryT["getAvailabilityFromResources"];

export async function calculateAvailability(
  request: Request,
  getVariantResources: GetVariantResources,
  getAvailabilityFromResources: GetAvailabilityFromResources
) {
  let requestedResources: Record<string, number> = {};

  const variants = _.pickBy(request.variants, (e) => e > 0);

  // Forge the resource request
  for (const variantId in variants) {
    const variantResources = await getRequestedResources(
      variantId,
      variants[variantId]!,
      getVariantResources
    );

    //complete the total requested resources
    for (const resourceId in variantResources) {
      requestedResources[resourceId] =
        (requestedResources?.[resourceId] ?? 0) + variantResources[resourceId]!;
    }
  }

  // Get the availabilities
  const availabilities = await getResourcesAvailability(
    Object.keys(requestedResources),
    request.shift,
    request.date,
    getAvailabilityFromResources
  );

  // Verify the availability and populate the lockers
  const reservationLockers = [];

  for (const requestedResource in requestedResources) {
    const resourceAvailabilities = availabilities?.[requestedResource] ?? [];
    const resourceLockers = [];
    let residualRequestedAmount = requestedResources[requestedResource]!;

    for (const resourceAvailability of resourceAvailabilities) {
      if (
        residualRequestedAmount === 0 ||
        resourceAvailability.residualAmount === 0
      ) {
        continue;
      } else if (
        resourceAvailability.residualAmount >= residualRequestedAmount
      ) {
        resourceLockers.push({
          amount: residualRequestedAmount,
          availability: resourceAvailability.id,
        });
        residualRequestedAmount = 0;
      } else if (
        resourceAvailability.residualAmount < residualRequestedAmount
      ) {
        resourceLockers.push({
          amount: resourceAvailability.residualAmount,
          availability: resourceAvailability.id,
        });
        residualRequestedAmount -= resourceAvailability.residualAmount;
      }
    }

    if (residualRequestedAmount === 0) {
      reservationLockers.push(...resourceLockers);
    } else {
      throw new Error(
        `No availability for resource ${requestedResource}, unfulfilled ${residualRequestedAmount} units`
      );
    }
  }

  return reservationLockers;
}

async function getRequestedResources(
  variantId: string,
  requestedAmount: number,
  getVariantResources: GetVariantResources
) {
  const variantResources = await getVariantResources(variantId);

  if (typeof variantResources !== "undefined" && variantResources.length) {
    return variantResources.reduce((acc: Record<ResourceId, number>, e) => {
      acc[e.resource.id] =
        (acc[e.resource.id] ?? 0) + e.amount * requestedAmount;
      return acc;
    }, {});
  }

  return {};
}

async function getResourcesAvailability(
  resourcesId: string[],
  shiftId: string,
  date: string,
  getAvailabilityFromResources: GetAvailabilityFromResources
) {
  const availabilities = await getAvailabilityFromResources(
    resourcesId,
    shiftId,
    date
  );
  const filteredAvailabilities = availabilities.map((e) => {
    const lockers = e.lockers.filter((l: any) => l.status);
    const residualAmount =
      e.amount -
      lockers.reduce((acc: number, l: { amount: number }) => acc + l.amount, 0);
    return { ...e, lockers, residualAmount };
  });

  return _(filteredAvailabilities).groupBy("resource").value();
}
