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

  return dayDiffer + 1;
}

export function isDateValid(startDate, endDate) {
  const dayDiffer = calculateDateDiffer(startDate, endDate);

  return dayDiffer >= MIN_DURATION;
}

export function formatDateMMDD(date) {
  const month = new Date(date).getMonth() + 1;
  const day = new Date(date).getDate();

  return `${month}월 ${day}일`;
}

export function formatDateKrTime(date) {
  const localDate = new Date(date).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return localDate.split('. ').join('-').slice(0, -1);
}
