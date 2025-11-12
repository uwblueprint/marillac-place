export function getToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function getBeginningOfWeek(): Date {
  const now = new Date();
  const dayIndex = now.getDay();

  const sunday = new Date(now);
  sunday.setHours(0, 0, 0, 0);
  sunday.setDate(now.getDate() - dayIndex);

  return sunday;
}
