import { generateTimetable } from "./timetable";

describe("supplier-availability/utils/timetable", () => {
  it("generate a timetable from an object list", () => {
    expect(
      generateTimetable(
        [
          {
            id: "03ec1b44-a0ae-4f0b-b3be-df125682ff9c",
            date: "2023-02-22",
            amount: 2,
            service: {
              id: "975b311e-0859-418b-a675-f4079fc49099",
              name: "Monte Nieddu in Land Rover",
            },
            shift: {
              id: "b1eee29d-7c7d-4f89-bf19-98d01e024807",
              name: "Pomeriggio",
            },
            resource: {
              id: "c211c0d8-5b90-41ea-992e-3399eca2e902",
              name: "Posto a sedere mattina",
            },
          },
          {
            id: "06e88af3-734d-4cbd-9015-31aebc4eb2d7",
            date: "2023-04-21",
            amount: 7,
            service: {
              id: "975b311e-0859-418b-a675-f4079fc49099",
              name: "Monte Nieddu in Land Rover",
            },
            shift: {
              id: "b1eee29d-7c7d-4f89-bf19-98d01e024807",
              name: "Pomeriggio",
            },
            resource: {
              id: "3047b207-5bd9-454a-93af-b2be21e5f9be",
              name: "Posto a sedere pomeriggio",
            },
          },
          {
            id: "074813cb-c62d-421a-a255-422802b1a04b",
            date: "2023-04-05",
            amount: 6,
            service: {
              id: "975b311e-0859-418b-a675-f4079fc49099",
              name: "Monte Nieddu in Land Rover",
            },
            shift: {
              id: "87b09d13-2c6a-4ed6-9508-3652378fd43f",
              name: "Mattina",
            },
            resource: {
              id: "c211c0d8-5b90-41ea-992e-3399eca2e902",
              name: "Posto a sedere mattina",
            },
          },
        ],
        []
      )
    ).toEqual({
      maxDate: "2023-04-21",
      minDate: "2023-02-22",
      timetable: {
        "975b311e-0859-418b-a675-f4079fc49099": {
          resource: {
            "3047b207-5bd9-454a-93af-b2be21e5f9be": {
              dates: {
                "2023-04-21": {
                  "b1eee29d-7c7d-4f89-bf19-98d01e024807": {
                    amount: 7,
                    id: "06e88af3-734d-4cbd-9015-31aebc4eb2d7",
                    lockers: [],
                  },
                },
              },
            },
            "c211c0d8-5b90-41ea-992e-3399eca2e902": {
              dates: {
                "2023-02-22": {
                  "b1eee29d-7c7d-4f89-bf19-98d01e024807": {
                    amount: 2,
                    id: "03ec1b44-a0ae-4f0b-b3be-df125682ff9c",
                    lockers: [],
                  },
                },
                "2023-04-05": {
                  "87b09d13-2c6a-4ed6-9508-3652378fd43f": {
                    amount: 6,
                    id: "074813cb-c62d-421a-a255-422802b1a04b",
                    lockers: [],
                  },
                },
              },
            },
          },
        },
      },
    });
  });
});
