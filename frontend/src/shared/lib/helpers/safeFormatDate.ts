import { format, isValid, toDate } from 'date-fns';

export type DateInput = string | number | Date | null | undefined;

export const DATE_FALLBACK = '—';

export const DEFAULT_DATE_FORMAT = 'dd.MM.yyyy';
const GO_ZERO_YEAR = 1;
export const safeFormatDate = (
  value: DateInput,
  dateFormat: string = DEFAULT_DATE_FORMAT,
  fallback: string = DATE_FALLBACK,
): string => {
  if (value === null || value === undefined || value === '') return fallback;

  const date = toDate(value);

  if (!isValid(date) || date.getUTCFullYear() === GO_ZERO_YEAR) return fallback;

  return format(date, dateFormat);
};
