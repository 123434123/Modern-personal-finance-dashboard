import {
  format,
  parseISO,
  isValid,
  differenceInCalendarDays,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday as isTodayFns,
  isBefore,
  isAfter,
  subMonths as subM,
  startOfYear,
} from 'date-fns';

// Every date in the app's data model is stored as an ISO string (yyyy-MM-dd
// or a full ISO timestamp). These helpers centralize parsing so a bad or
// missing date never throws — it just falls back to "now".

export function toDate(value) {
  if (!value) return new Date();
  if (value instanceof Date) return isValid(value) ? value : new Date();
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : new Date();
}

export function formatDate(value, pattern = 'MMM d, yyyy') {
  const date = toDate(value);
  try {
    return format(date, pattern);
  } catch {
    return '—';
  }
}

export function formatShortDate(value) {
  return formatDate(value, 'MMM d');
}

export function toISODate(date = new Date()) {
  const d = date instanceof Date ? date : toDate(date);
  return format(d, 'yyyy-MM-dd');
}

export function daysUntil(value) {
  return differenceInCalendarDays(toDate(value), new Date());
}

export function isOverdue(value) {
  return isBefore(toDate(value), new Date()) && !isSameDay(toDate(value), new Date());
}

export function isUpcomingWithin(value, days = 7) {
  const diff = daysUntil(value);
  return diff >= 0 && diff <= days;
}

export { addMonths, subMonths, isSameMonth, isSameDay, isBefore, isAfter, startOfYear };
export const isToday = (value) => isTodayFns(toDate(value));

export function getMonthLabel(date) {
  return format(date, 'MMMM yyyy');
}

// Builds the 6-week (42 day) grid used by the calendar page, always starting
// on Sunday and always fully covering the target month.
export function buildCalendarGrid(monthDate) {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);
  return eachDayOfInterval({ start: gridStart, end: gridEnd });
}

// Returns { start, end } Date objects for a named analytics range.
export function getRangeForFilter(filterId) {
  const now = new Date();
  switch (filterId) {
    case 'this-month':
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case 'last-month': {
      const last = subM(now, 1);
      return { start: startOfMonth(last), end: endOfMonth(last) };
    }
    case 'last-3-months':
      return { start: startOfMonth(subM(now, 2)), end: endOfMonth(now) };
    case 'last-6-months':
      return { start: startOfMonth(subM(now, 5)), end: endOfMonth(now) };
    case 'this-year':
      return { start: startOfYear(now), end: endOfMonth(now) };
    default:
      return { start: startOfMonth(subM(now, 5)), end: endOfMonth(now) };
  }
}

export function isDateWithinRange(value, range) {
  const date = toDate(value);
  return !isBefore(date, range.start) && !isAfter(date, range.end);
}

export function monthsCountForFilter(filterId) {
  switch (filterId) {
    case 'this-month':
    case 'last-month':
      return 1;
    case 'last-3-months':
      return 3;
    case 'last-6-months':
      return 6;
    case 'this-year':
      return new Date().getMonth() + 1;
    default:
      return 6;
  }
}

export function lastNMonthLabels(n = 6) {
  const now = new Date();
  const labels = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    labels.push(format(subM(now, i), 'MMM yyyy'));
  }
  return labels;
}
