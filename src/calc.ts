import { Parser } from 'expr-eval';
import numbro from 'numbro';
import lang from 'numbro/languages/de-DE';
import { dateFunctions } from './date-functions';

// Configure numbro support European number formats
numbro.registerLanguage(lang);
numbro.setLanguage('de-DE');

interface HandlebarsHelperOptions {
  data?: {
    root?: Record<string, any>;
  };
  hash?: Record<string, any>;
}

type SpreadsheetFunction = (...args: any[]) => any;

function coerceToNumber(value: any): any {
  // Return numbers as-is
  if (typeof value === 'number') return value;

  // Only convert strings that look like numbers
  if (typeof value === 'string') {
    const trimmed = value.trim();

    // Empty strings stay as empty strings
    if (trimmed === '') return value;

    // Check if it looks like a date pattern (don't convert dates to numbers)
    const datePatterns = [
      /^\d{1,2}\.\d{1,2}\.\d{2,4}/, // German date: DD.MM.YYYY or D.M.YY
      /^\d{1,2}\/\d{1,2}\/\d{2,4}/, // US/European date: MM/DD/YYYY or DD/MM/YYYY
      /^\d{4}[-/]\d{1,2}[-/]\d{1,2}/, // ISO or Asian: YYYY-MM-DD or YYYY/MM/DD
    ];

    if (datePatterns.some((pattern) => pattern.test(trimmed))) {
      // This looks like a date, don't convert it
      return value;
    }

    // Check if it looks like a number (contains digits and valid separators)
    if (/^-?[\d\s.,]+$/.test(trimmed)) {
      // Handle space separators manually (numbro doesn't support them in de-DE)
      let normalized = trimmed;

      // If it has spaces and comma as decimal, convert spaces to dots for numbro
      if (/\s/.test(trimmed) && /,\d+$/.test(trimmed)) {
        normalized = trimmed.replace(/\s/g, '.');
      }

      // Use numbro with German locale for European format support
      const result = numbro.unformat(normalized);
      return Number.isNaN(result) ? value : result;
    }

    // Not number-like, return original string
    return value;
  }

  // For other types, return as-is
  return value;
}

const FX: Record<string, SpreadsheetFunction> = {
  ABS: (v: number): number => Math.abs(Number(v)),

  AND: (...args: any[]): boolean => args.every((arg) => !!arg),

  AVERAGE: (...args: number[]): number => {
    const numbers = args.map(Number).filter((n) => !Number.isNaN(n));
    return numbers.length > 0
      ? numbers.reduce((a, b) => a + b, 0) / numbers.length
      : 0;
  },

  CEIL: (v: number): number => Math.ceil(Number(v)),

  FLOOR: (v: number): number => Math.floor(Number(v)),

  IF: (condition: any, valueIfTrue: any, valueIfFalse: any): any =>
    condition ? valueIfTrue : valueIfFalse,

  MAX: (...args: number[]): number =>
    Math.max(...args.map(Number).filter((n) => !Number.isNaN(n))),

  MIN: (...args: number[]): number =>
    Math.min(...args.map(Number).filter((n) => !Number.isNaN(n))),

  NOT: (condition: any): boolean => !condition,

  OR: (...args: any[]): boolean => args.some((arg) => !!arg),

  RAND: (): number => Math.random(),

  ROUND: (v: number, places: number = 0): number => {
    const factor = 10 ** Number(places);
    return Math.round(Number(v) * factor) / factor;
  },

  SUM: (...args: number[]): number =>
    args.reduce((sum, val) => sum + Number(val || 0), 0),
};

const parser = new Parser({
  operators: {
    add: true,
    concatenate: false,
    conditional: true,
    logical: true,
    comparison: true,
    in: false,
  },
});

function calc(
  this: any,
  expr: string,
  options?: HandlebarsHelperOptions,
): string | number {
  // Create a proxy scope that normalizes values on access (recursively)
  const createNormalizingProxy = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') {
      return coerceToNumber(obj);
    }

    if (Array.isArray(obj)) {
      return new Proxy(obj, {
        get(target, prop: string | symbol) {
          const value = target[prop as any];
          if (typeof prop === 'string' && !Number.isNaN(Number(prop))) {
            return createNormalizingProxy(value);
          }
          return value;
        },
      });
    }

    return new Proxy(obj, {
      get(target, prop: string | symbol) {
        if (typeof prop === 'string' && prop in target) {
          const value = target[prop];
          return createNormalizingProxy(value);
        }
        return target[prop as string];
      },
    });
  };

  const scope = Object.assign(
    {},
    createNormalizingProxy(options?.data?.root || {}),
    createNormalizingProxy(this || {}),
    createNormalizingProxy(options?.hash || {}),
    FX,
    dateFunctions,
    { undefined: undefined },
  );

  try {
    const ast = parser.parse(String(expr));
    const result = ast.evaluate(scope);

    return result == null || result === undefined ? '' : result;
  } catch (err) {
    if (options?.hash && 'default' in options.hash) {
      return options.hash.default;
    }

    if ((err as Error).message.includes('undefined variable')) {
      return '';
    }

    throw new Error(`calc: ${(err as Error).message}`);
  }
}

export default calc;
