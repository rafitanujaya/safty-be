export const getDateRangeFromDays = (days: number) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
};

export const formatDateKey = (date: Date) => {
  return date.toISOString().split("T")[0];
};
