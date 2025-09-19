import { Parser } from 'expr-eval';

interface HandlebarsHelperOptions {
  data?: {
    root?: Record<string, any>;
  };
  hash?: Record<string, any>;
}

type SpreadsheetFunction = (...args: any[]) => any;

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
  const scope = Object.assign(
    {},
    options?.data?.root || {},
    this || {},
    options?.hash || {},
    FX,
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
