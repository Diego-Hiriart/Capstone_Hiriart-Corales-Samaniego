export const addWeeksToDate = (date: Date, numberOfWeeks: number) => {
  date.setDate(date.getDate() + numberOfWeeks * 7);
  return date;
};
