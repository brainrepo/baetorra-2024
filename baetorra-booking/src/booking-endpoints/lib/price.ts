import _ from "lodash";
import { Request, VariantPrice } from "../types";
import { RepositoryT } from "../services/repository";
type GetPricesByVariantSellerShift =
  RepositoryT["getPricesByVariantSellerShift"];

export async function calculatePrice(
  request: Request,
  userId: string,
  getPricesByVariantSellerShift: GetPricesByVariantSellerShift
) {
  const variants = _.pickBy(request.variants, (e) => e > 0);
  let prices: Record<string, VariantPrice> = {};

  for (const variant in variants) {
    const p = await getPricesByVariantSellerShift(
      variant,
      userId,
      request.shift,
      request.date
    );

    const price = p?.[0];

    if (!price) {
      prices[variant] = {
        type: "error",
        message: "Price not available contact supplier",
      };
    } else {
      prices[variant] = {
        amount: variants[variant]!,
        type: "price",
        value: price.price,
        fees: price.fee,
        total: (price.price + price.fee) * variants[variant]!,
        deposit: price.deposit,
        balance: price.balance,
      };
    }
  }

  return prices;
}
