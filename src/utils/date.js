export function calculateDateDiffer(startDate, endDate) {
  if (!startDate || !endDate) {
    return 0;
  }

  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);
  const timeDiffer = parsedEndDate - parsedStartDate;
  const dayDiffer = timeDiffer / (1000 * 60 * 60 * 24);

  return dayDiffer;
}

export function isDateValid(startDate, endDate) {
  const dayDiffer = calculateDateDiffer(startDate, endDate);

  return dayDiffer >= 2;
}

export function formatDate(date) {
  return date.slice(0, 10);
}
