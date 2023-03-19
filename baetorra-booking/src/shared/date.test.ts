import { extractMinMaxDate } from "./date";

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
});
