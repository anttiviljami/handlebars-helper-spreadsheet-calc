import { DateTime } from 'luxon';

type SpreadsheetFunction = (...args: any[]) => any;

function parseDate(value: any, tz?: string): DateTime | null {
  if (!value) return null;

  try {
    if (value instanceof Date) {
      return DateTime.fromJSDate(value, { zone: tz || 'utc' });
    }

    if (typeof value === 'string') {
      // Try ISO format first
      const iso = DateTime.fromISO(value, { zone: tz || 'utc' });
      if (iso.isValid) return iso;

      // If not ISO, don't guess - require explicit parsing
      return null;
    }

    if (typeof value === 'number') {
      return DateTime.fromMillis(value, { zone: tz || 'utc' });
    }

    return null;
  } catch {
    return null;
  }
}

function validateUnit(unit: string): string {
  const validUnits = [
    'years',
    'quarters',
    'months',
    'weeks',
    'days',
    'hours',
    'minutes',
    'seconds',
  ];
  const normalizedUnit = unit.toLowerCase();
  if (validUnits.includes(normalizedUnit)) {
    return normalizedUnit as any;
  }
  throw new Error(
    `Invalid date unit: ${unit}. Valid units are: ${validUnits.join(', ')}`,
  );
}

export const dateFunctions: Record<string, SpreadsheetFunction> = {
  NOW: (tz?: string): string => {
    const dt = DateTime.now().setZone(tz || 'utc');
    return dt.toISO() || '';
  },

  TODAY: (tz?: string): string => {
    const dt = DateTime.now().setZone(tz || 'utc');
    return dt.toISODate() || '';
  },

  DATEADD: (date: any, value: number, unit: string, tz?: string): string => {
    const dt = parseDate(date, tz);
    if (!dt) throw new Error('Invalid date');

    const validatedUnit = validateUnit(unit);
    const result = dt.plus({ [validatedUnit]: Number(value) });

    // Return same "kind" as input - if input was date-only, return date-only
    const isDateOnly =
      typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date);
    return isDateOnly ? result.toISODate() || '' : result.toISO() || '';
  },

  DATEDIFF: (start: any, end: any, unit: string, tz?: string): number => {
    const startDt = parseDate(start, tz);
    const endDt = parseDate(end, tz);

    if (!startDt || !endDt) throw new Error('Invalid date(s)');

    const validatedUnit = validateUnit(unit);
    const diff = endDt.diff(startDt, validatedUnit as any);

    return Math.floor(diff.as(validatedUnit as any) || 0);
  },

  WEEKNUM: (date: any, type?: number | string, tz?: string): number => {
    const dt = parseDate(date, tz);
    if (!dt) throw new Error('Invalid date');

    if (type === 'ISO' || type === 2) {
      return dt.weekNumber;
    }

    // Default to ISO week numbering for simplicity
    return dt.weekNumber;
  },

  YEAR: (date: any, tz?: string): number => {
    const dt = parseDate(date, tz);
    if (!dt) throw new Error('Invalid date');
    return dt.year;
  },

  MONTH: (date: any, tz?: string): number => {
    const dt = parseDate(date, tz);
    if (!dt) throw new Error('Invalid date');
    return dt.month;
  },

  DAY: (date: any, tz?: string): number => {
    const dt = parseDate(date, tz);
    if (!dt) throw new Error('Invalid date');
    return dt.day;
  },

  HOUR: (date: any, tz?: string): number => {
    const dt = parseDate(date, tz);
    if (!dt) throw new Error('Invalid date');
    return dt.hour;
  },

  MINUTE: (date: any, tz?: string): number => {
    const dt = parseDate(date, tz);
    if (!dt) throw new Error('Invalid date');
    return dt.minute;
  },

  SECOND: (date: any, tz?: string): number => {
    const dt = parseDate(date, tz);
    if (!dt) throw new Error('Invalid date');
    return dt.second;
  },

  WEEKDAY: (date: any, type?: number, tz?: string): number => {
    const dt = parseDate(date, tz);
    if (!dt) throw new Error('Invalid date');

    const luxonWeekday = dt.weekday; // 1=Monday, 7=Sunday

    // Convert to different conventions
    if (type === 1) {
      // 1=Sunday, 7=Saturday (Excel default)
      return luxonWeekday === 7 ? 1 : luxonWeekday + 1;
    } else if (type === 2 || type === 3) {
      // 2: 1=Monday, 7=Sunday (ISO)
      // 3: 0=Monday, 6=Sunday
      return type === 3 ? luxonWeekday - 1 : luxonWeekday;
    }

    // Default to ISO (type 2)
    return luxonWeekday;
  },
};
