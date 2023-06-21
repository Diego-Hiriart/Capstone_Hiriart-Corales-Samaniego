/* eslint-disable no-loops/no-loops */

export const addWeeksToDate = (date: Date, numberOfWeeks: number) => {
  date.setDate(date.getDate() + numberOfWeeks * 7);
  return date;
};

interface DateRange {
  begin: Date;
  end: Date;
}

export const getDaysArray = (start: Date, end: Date, id: number) => {
  const arr = [];
  const startDate: Date = new Date(start);
  const endDate: Date = new Date(end);

  for (
    let dt = new Date(startDate);
    dt <= endDate;
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push({ id: id, date: new Date(dt) });
  }

  return arr;
};

export const getMicroCyclesDates = (
  startDate: Date,
  endDate: Date
): DateRange[] => {
  const addDays = (date: Date, days: number): Date => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  };

  const adjustToMonday = (date: Date): Date => {
    const adjustedDate = new Date(date);
    if (adjustedDate.getDay() > 1) {
      adjustedDate.setDate(adjustedDate.getDate() - adjustedDate.getDay());
    }
    return adjustedDate;
  };

  const generateDateRange = (start: Date, end: Date): DateRange[] => {
    const dates: DateRange[] = [];
    let newStart = start;
    let monday = adjustToMonday(start);

    while (newStart <= end) {
      const endWeekDate = addDays(monday, 7);

      if (endWeekDate > end) {
        dates.push({ begin: newStart, end });
      } else {
        dates.push({ begin: newStart, end: endWeekDate });
      }
      newStart = addDays(monday, 8);
      monday = addDays(monday, 7);
    }

    return dates;
  };

  return generateDateRange(startDate, endDate);
};
