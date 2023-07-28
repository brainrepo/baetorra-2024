import { calculateAvailability } from "./availability";
import {
  AVAILABILITY,
  VARIANT_RESOURCE_1,
  VARIANT_RESOURCE_2,
  VARIANT_RESOURCE_NO_RESOURCE,
} from "./availability-mocks";

describe("availability", () => {
  const getVariantResources = jest.fn();
  const getAvailabilityFromResources = jest.fn();
  it("fullfills", async () => {
    getVariantResources
      .mockResolvedValueOnce(VARIANT_RESOURCE_1)
      .mockResolvedValueOnce(VARIANT_RESOURCE_2);
    getAvailabilityFromResources.mockResolvedValueOnce(AVAILABILITY);

    const request = {
      service: "1",
      shift: "shift-1",
      date: "2024-05-11",
      variants: {
        adults: 1,
        childs: 2,
      },
      seller: "seller-2",
    };
    const result = await calculateAvailability(
      request,
      getVariantResources,
      getAvailabilityFromResources
    );
    expect(result).toEqual([
      { amount: 3, availability: "availability-1" },
      { amount: 4, availability: "availability-2" },
    ]);
    expect(getVariantResources).nthCalledWith(1, "adults");
    expect(getVariantResources).nthCalledWith(2, "childs");

    expect(getAvailabilityFromResources).toBeCalledWith(
      ["resource-1", "resource-2"],
      "shift-1",
      "2024-05-11"
    );
  });
  it("variant without configured resource", async () => {
    getVariantResources.mockResolvedValueOnce(VARIANT_RESOURCE_NO_RESOURCE);
    getVariantResources.mockResolvedValueOnce(VARIANT_RESOURCE_1);
    getAvailabilityFromResources.mockResolvedValueOnce(AVAILABILITY);

    const request = {
      service: "1",
      shift: "shift-1",
      date: "2024-05-11",
      variants: {
        adults: 1,
        childs: 2,
      },
      seller: "seller-2",
    };
    const result = await calculateAvailability(
      request,
      getVariantResources,
      getAvailabilityFromResources
    );
    expect(result).toEqual([{ amount: 2, availability: "availability-1" }]);
    expect(getVariantResources).nthCalledWith(1, "adults");
    expect(getVariantResources).nthCalledWith(2, "childs");

    expect(getAvailabilityFromResources).toBeCalledWith(
      ["resource-1", "resource-2"],
      "shift-1",
      "2024-05-11"
    );
  });
  it("no availability", async () => {
    getVariantResources.mockResolvedValueOnce(VARIANT_RESOURCE_NO_RESOURCE);
    getVariantResources.mockResolvedValueOnce(VARIANT_RESOURCE_1);
    getAvailabilityFromResources.mockResolvedValueOnce(AVAILABILITY);

    const request = {
      service: "1",
      shift: "shift-1",
      date: "2024-05-11",
      variants: {
        adults: 1,
        childs: 6,
      },
      seller: "seller-2",
    };
    expect(
      calculateAvailability(
        request,
        getVariantResources,
        getAvailabilityFromResources
      )
    ).rejects.toThrow(
      "No availability for resource resource-1, unfulfilled 1 units"
    );
    expect(getVariantResources).nthCalledWith(1, "adults");
    expect(getVariantResources).nthCalledWith(2, "childs");

    expect(getAvailabilityFromResources).toBeCalledWith(
      ["resource-1", "resource-2"],
      "shift-1",
      "2024-05-11"
    );
  });
  it("concurrent resources", async () => {
    getVariantResources
      .mockResolvedValueOnce(VARIANT_RESOURCE_1)
      .mockResolvedValueOnce(VARIANT_RESOURCE_2);
    getAvailabilityFromResources.mockResolvedValueOnce(AVAILABILITY);

    const request = {
      service: "1",
      shift: "shift-1",
      date: "2024-05-11",
      variants: {
        adults: 3, //3 resource-1
        childs: 4, //4 resource-1 + (4*2) resource-2
      },
      seller: "seller-2",
    };
    expect(
      calculateAvailability(
        request,
        getVariantResources,
        getAvailabilityFromResources
      )
    ).rejects.toThrow(
      "No availability for resource resource-1, unfulfilled 2 units"
    );

    expect(getVariantResources).nthCalledWith(1, "adults");
    expect(getVariantResources).nthCalledWith(2, "childs");

    expect(getAvailabilityFromResources).toBeCalledWith(
      ["resource-1", "resource-2"],
      "shift-1",
      "2024-05-11"
    );
  });
});
