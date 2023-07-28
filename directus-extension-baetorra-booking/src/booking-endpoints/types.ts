// Sync with hooks
export interface Service {
  id: string;
  name: string;
  shifts: Shift[];
  variants: Variant[];
  seller_helper_notice: string;
  sellers: Seller[];
}

interface Shift {
  id: string;
  name: string;
}

interface Seller {
  directus_users_id: string;
}

interface Variant {
  id: string;
  name: string;
}

export interface Request {
  service: string;
  shift: string;
  date: string;
  variants: Record<string, number>;
  seller: string;
}

export interface BookingRequest {
  service: string;
  shift: string;
  date: string;
  variants: Record<string, number>;
  seller: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface Price {
  color: string;
  fee: number;
  from: string;
  to: string;
  name: string;
  price: number;
}

// Responses

export type VariantPrice =
  | {
      type: "price";
      amount: number;
      value: number;
      fees: number;
      total: number;
    }
  | {
      type: "error";
      message: string;
    };
