import { dateDiff, extractMinMaxDate } from "./date";

describe("shared/date", () => {
  it("calculate min and max date from an array of objects", () => {
    expect(
      extractMinMaxDate(
        [
          { date: "2022-11-10" },
          { date: "2021-11-10" },
          { date: "2022-12-9" },
          { date: "2020-01-01" },
        ],
        "date"
      )
    ).toEqual(["2020-01-01", "2022-12-9"]);
  });

  describe("calculate the date diff", () => {
    it("date a > date b", () => {
      expect(dateDiff("2022-05-10", "2022-05-9")).toBe(1);
    });

    it("date b > date a", () => {
      expect(dateDiff("2022-05-1", "2022-05-9")).toBe(-8);
    });

    it("use current date as second date", () => {
      expect(dateDiff("2023-05-1")).toBeLessThan(1);
    });
  });
});
