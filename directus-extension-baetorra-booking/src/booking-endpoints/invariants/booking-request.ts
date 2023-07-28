import { dateDiff } from "../../shared/date";
import { areSetsEqual } from "../../shared/sets";
import { Request, Service } from "../types";

export function validateRequest(
  request: Request,
  service: Service | undefined,
  seller: string
): boolean {
  if (!service) return false;
  if (!requestedDateIsGreaterEqualsToday(request)) return false;
  if (!isThereShift(request)) return false;
  if (!isThereAtLeastOneVariant(request)) return false;
  if (!areTheVariantsCorrect(request, service)) return false;
  if (!canISell(request, service, seller)) return false;
  return true;
}

function isThereShift(request: Request) {
  if (!request?.shift) return false;
  return true;
}

function canISell(request: Request, service: Service, seller: string) {
  if (request.seller !== seller) return false;

  return service.sellers.map((s) => s.directus_users_id).includes(seller);
}

function isThereAtLeastOneVariant(request: Request) {
  return Object.values(request?.variants)?.length > 0;
}

function areTheVariantsCorrect(request: Request, service: Service) {
  const requestedVariants = new Set(Object.keys(request.variants));
  const serviceVariants = new Set(service.variants.map((e) => e.id));
  return areSetsEqual(requestedVariants, serviceVariants);
}

function requestedDateIsGreaterEqualsToday(request: Request) {
  return dateDiff(request.date) >= 0;
}
