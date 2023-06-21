import { addWeeksToDate, getDaysArray, getMicroCyclesDates } from "./dates";

describe("dates", () => {
  describe("addWeeksToDate", () => {
    it("returns adds one week to the date passed", () => {
      const date = new Date("01/01/2001");
      expect(addWeeksToDate(date, 1)).toStrictEqual(new Date("01/08/2001"));
    });

    it("returns adds 0 weeks to the date passed", () => {
      const date = new Date("01/01/2001");
      expect(addWeeksToDate(date, 0)).toStrictEqual(new Date("01/01/2001"));
    });

    it("returns adds 2 weeks to the date passed", () => {
      const date = new Date("01/01/2001");
      expect(addWeeksToDate(date, 2)).toStrictEqual(new Date("01/15/2001"));
    });
  });

  describe("getDaysArray", () => {
    it("returns 2 arrays corresponding to two microcycles", () => {
      const microCycles = [
        {
          microCycleID: 1,
          startDate: new Date("2023-06-13T05:00:00.000Z"),
          endDate: new Date("2023-06-18T05:00:00.000Z"),
        },
        {
          microCycleID: 2,
          startDate: new Date("2023-06-19T05:00:00.000Z"),
          endDate: new Date("2023-06-24T05:00:00.000Z"),
        },
      ];

      const expected = [
        [
          { id: 1, date: new Date("2023-06-13T05:00:00.000Z") },
          { id: 1, date: new Date("2023-06-14T05:00:00.000Z") },
          { id: 1, date: new Date("2023-06-15T05:00:00.000Z") },
          { id: 1, date: new Date("2023-06-16T05:00:00.000Z") },
          { id: 1, date: new Date("2023-06-17T05:00:00.000Z") },
          { id: 1, date: new Date("2023-06-18T05:00:00.000Z") },
        ],
        [
          { id: 2, date: new Date("2023-06-19T05:00:00.000Z") },
          { id: 2, date: new Date("2023-06-20T05:00:00.000Z") },
          { id: 2, date: new Date("2023-06-21T05:00:00.000Z") },
          { id: 2, date: new Date("2023-06-22T05:00:00.000Z") },
          { id: 2, date: new Date("2023-06-23T05:00:00.000Z") },
          { id: 2, date: new Date("2023-06-24T05:00:00.000Z") },
        ],
      ];

      const dates = microCycles.map((cycle) =>
        getDaysArray(cycle.startDate, cycle.endDate, cycle.microCycleID)
      );

      expect(dates).toStrictEqual(expected);
    });

    it("returns 1 array corresponding to one microcycles", () => {
      const microCycles = [
        {
          microCycleID: 1,
          startDate: new Date("2023-06-13T05:00:00.000Z"),
          endDate: new Date("2023-06-18T05:00:00.000Z"),
        },
      ];

      const expected = [
        [
          { id: 1, date: new Date("2023-06-13T05:00:00.000Z") },
          { id: 1, date: new Date("2023-06-14T05:00:00.000Z") },
          { id: 1, date: new Date("2023-06-15T05:00:00.000Z") },
          { id: 1, date: new Date("2023-06-16T05:00:00.000Z") },
          { id: 1, date: new Date("2023-06-17T05:00:00.000Z") },
          { id: 1, date: new Date("2023-06-18T05:00:00.000Z") },
        ],
      ];

      const dates = microCycles.map((cycle) =>
        getDaysArray(cycle.startDate, cycle.endDate, cycle.microCycleID)
      );

      expect(dates).toStrictEqual(expected);
    });
  });

  describe("getMicroCyclesDates", () => {
    it("returns the same dates if the dates are in the same week", () => {
      const startDate = new Date("2023-06-08T05:00:00.000Z");
      const endDate = new Date("2023-06-11T05:00:00.000Z");

      const expected = [
        {
          begin: new Date("2023-06-08T05:00:00.000Z"),
          end: new Date("2023-06-11T05:00:00.000Z"),
        },
      ];

      expect(getMicroCyclesDates(startDate, endDate)).toStrictEqual(expected);
    });

    it("returns two objects if the dates are in two weeks", () => {
      const startDate = new Date("2023-06-07T05:00:00.000Z");
      const endDate = new Date("2023-06-18T05:00:00.000Z");

      const expected = [
        {
          begin: new Date("2023-06-07T05:00:00.000Z"),
          end: new Date("2023-06-11T05:00:00.000Z"),
        },
        {
          begin: new Date("2023-06-12T05:00:00.000Z"),
          end: new Date("2023-06-18T05:00:00.000Z"),
        },
      ];

      expect(getMicroCyclesDates(startDate, endDate)).toStrictEqual(expected);
    });

    it("returns empty if a date is wrongly parsed", () => {
      const startDate = new Date("2023-06-07T05:00:00.000Z ");
      const endDate = new Date("2023-06-18T05:00:00.000Z");

      expect(getMicroCyclesDates(startDate, endDate)).toStrictEqual([]);
    });
  });
});
