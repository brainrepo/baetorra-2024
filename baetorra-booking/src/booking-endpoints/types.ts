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

export interface Price {
  color: string;
  fee: number;
  from: string;
  to: string;
  name: string;
  price: number;
}
