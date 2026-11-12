import { 
  format, 
  parseISO, 
  differenceInWeeks, 
  differenceInDays, 
  isAfter, 
  isBefore, 
  startOfMonth, 
  endOfMonth,
  addMonths,
  subMonths
} from "date-fns";

export function getCurrentMonthKey(): string {
  return format(new Date(), "yyyy-MM");
}

export function formatMonthDisplay(monthKey: string): string {
  try {
    const [year, month] = monthKey.split("-").map(Number);
    const date = new Date(year, month - 1, 1);
    return format(date, "MMMM yyyy");
  } catch {
    return monthKey;
  }
}

export function formatDisplayDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "MMM dd, yyyy");
  } catch {
    return dateStr;
  }
}

export function formatRelativeDate(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    const today = new Date();
    const daysDiff = differenceInDays(today, date);

    if (daysDiff === 0) return "Today";
    if (daysDiff === 1) return "Yesterday";
    if (daysDiff > 1 && daysDiff < 7) return `${daysDiff} days ago`;
    return format(date, "MMM d");
  } catch {
    return dateStr;
  }
}

export function getWeeksRemaining(deadlineStr?: string): number {
  if (!deadlineStr) return 0;
  try {
    const deadline = parseISO(deadlineStr);
    const today = new Date();
    if (isBefore(deadline, today)) return 0;
    const weeks = differenceInWeeks(deadline, today);
    return Math.max(weeks, 1);
  } catch {
    return 0;
  }
}

export function getDaysRemaining(deadlineStr?: string): number {
  if (!deadlineStr) return 0;
  try {
    const deadline = parseISO(deadlineStr);
    const today = new Date();
    if (isBefore(deadline, today)) return 0;
    return differenceInDays(deadline, today);
  } catch {
    return 0;
  }
}

export function isDateOverdue(deadlineStr?: string): boolean {
  if (!deadlineStr) return false;
  try {
    const deadline = parseISO(deadlineStr);
    const today = new Date();
    return isBefore(deadline, today);
  } catch {
    return false;
  }
}

export function getMonthRange(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  const start = startOfMonth(new Date(year, month - 1, 1));
  const end = endOfMonth(new Date(year, month - 1, 1));
  return { start, end };
}

export function getAdjacentMonth(monthKey: string, delta: number): string {
  const [year, month] = monthKey.split("-").map(Number);
  const current = new Date(year, month - 1, 1);
  const target = delta > 0 ? addMonths(current, delta) : subMonths(current, Math.abs(delta));
  return format(target, "yyyy-MM");
}
