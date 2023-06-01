export const VARIANT_RESOURCE_1 = [
  {
    resource: {
      id: "resource-1",
    },
    amount: 1,
  },
];
export const VARIANT_RESOURCE_2 = [
  {
    resource: {
      id: "resource-1",
    },
    amount: 1,
  },
  {
    resource: {
      id: "resource-2",
    },
    amount: 2,
  },
];
export const VARIANT_RESOURCE_NO_RESOURCE = [];

export const AVAILABILITY = [
  {
    id: "availability-1",
    resource: "resource-1",
    amount: "10",
    lockers: [
      { amount: 5, status: true },
      { amount: 2, status: false },
    ],
  },
  {
    id: "availability-2",
    resource: "resource-2",
    amount: "100",
    lockers: [{ amount: 10, status: true }],
  },
];
