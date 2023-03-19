export type Item = {
  date: string;
  id: string;
  shift: {
    id: string;
    name: string;
  };
  service: {
    id: string;
    name: string;
  };
  resource: {
    id: string;
    name: string;
  };
  amount: number;
};
