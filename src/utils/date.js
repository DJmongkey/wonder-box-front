const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
const MIN_DURATION = 2;

export function calculateDateDiffer(startDate, endDate) {
  if (!startDate || !endDate) {
    return 0;
  }

  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);
  const timeDiffer = parsedEndDate - parsedStartDate;
  const dayDiffer = timeDiffer / MILLISECONDS_PER_DAY;

  return dayDiffer;
}

export function isDateValid(startDate, endDate) {
  const dayDiffer = calculateDateDiffer(startDate, endDate);

  return dayDiffer >= MIN_DURATION;
}

export function formatDate(date) {
  return date.slice(0, 10);
}

export function plusDay(startDate, index) {
  const newDate = new Date(startDate);
  newDate.setDate(newDate.getDate() + index);

  const formattedDate = formatDate(newDate.toISOString());

  return formattedDate;
}
