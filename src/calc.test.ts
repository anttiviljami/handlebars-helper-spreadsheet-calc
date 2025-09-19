import Handlebars from 'handlebars';
import { describe, expect, it } from 'vitest';
import calc from './calc';

Handlebars.registerHelper('calc', calc);

describe('handlebars-helper-spreadsheet-calc', () => {
  describe('arithmetic operators', () => {
    it('should handle addition', () => {
      const template = Handlebars.compile('{{calc "2 + 3"}}');
      expect(template({})).toBe('5');
    });

    it('should handle subtraction', () => {
      const template = Handlebars.compile('{{calc "10 - 3"}}');
      expect(template({})).toBe('7');
    });

    it('should handle multiplication', () => {
      const template = Handlebars.compile('{{calc "4 * 5"}}');
      expect(template({})).toBe('20');
    });

    it('should handle division', () => {
      const template = Handlebars.compile('{{calc "15 / 3"}}');
      expect(template({})).toBe('5');
    });

    it('should handle exponentiation', () => {
      const template = Handlebars.compile('{{calc "2 ^ 3"}}');
      expect(template({})).toBe('8');
    });

    it('should handle modulus', () => {
      const template = Handlebars.compile('{{calc "10 % 3"}}');
      expect(template({})).toBe('1');
    });

    it('should handle parentheses', () => {
      const template = Handlebars.compile('{{calc "(2 + 3) * 4"}}');
      expect(template({})).toBe('20');
    });

    it('should handle negation', () => {
      const template = Handlebars.compile('{{calc "-5"}}');
      expect(template({})).toBe('-5');
    });
  });

  describe('spreadsheet functions', () => {
    it('should handle ABS function', () => {
      const template = Handlebars.compile('{{calc "ABS(-5)"}}');
      expect(template({})).toBe('5');
    });

    it('should handle AND function', () => {
      const template1 = Handlebars.compile('{{calc "AND(1, 1)"}}');
      expect(template1({})).toBe('true');

      const template2 = Handlebars.compile('{{calc "AND(1, 0)"}}');
      expect(template2({})).toBe('false');
    });

    it('should handle AVERAGE function', () => {
      const template = Handlebars.compile('{{calc "AVERAGE(2, 4, 6)"}}');
      expect(template({})).toBe('4');
    });

    it('should handle CEIL function', () => {
      const template = Handlebars.compile('{{calc "CEIL(4.2)"}}');
      expect(template({})).toBe('5');
    });

    it('should handle FLOOR function', () => {
      const template = Handlebars.compile('{{calc "FLOOR(4.8)"}}');
      expect(template({})).toBe('4');
    });

    it('should handle IF function', () => {
      const template1 = Handlebars.compile(
        '{{calc "IF(1, \\"yes\\", \\"no\\")"}}',
      );
      expect(template1({})).toBe('yes');

      const template2 = Handlebars.compile(
        '{{calc "IF(0, \\"yes\\", \\"no\\")"}}',
      );
      expect(template2({})).toBe('no');
    });

    it('should handle MAX function', () => {
      const template = Handlebars.compile('{{calc "MAX(1, 5, 3)"}}');
      expect(template({})).toBe('5');
    });

    it('should handle MIN function', () => {
      const template = Handlebars.compile('{{calc "MIN(1, 5, 3)"}}');
      expect(template({})).toBe('1');
    });

    it('should handle NOT function', () => {
      const template1 = Handlebars.compile('{{calc "NOT(0)"}}');
      expect(template1({})).toBe('true');

      const template2 = Handlebars.compile('{{calc "NOT(1)"}}');
      expect(template2({})).toBe('false');
    });

    it('should handle OR function', () => {
      const template1 = Handlebars.compile('{{calc "OR(0, 1)"}}');
      expect(template1({})).toBe('true');

      const template2 = Handlebars.compile('{{calc "OR(0, 0)"}}');
      expect(template2({})).toBe('false');
    });

    it('should handle RAND function', () => {
      const template = Handlebars.compile('{{calc "RAND()"}}');
      const result = parseFloat(template({}));
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(1);
    });

    it('should handle ROUND function', () => {
      const template1 = Handlebars.compile('{{calc "ROUND(4.567)"}}');
      expect(template1({})).toBe('5');

      const template2 = Handlebars.compile('{{calc "ROUND(4.567, 2)"}}');
      expect(template2({})).toBe('4.57');
    });

    it('should handle SUM function', () => {
      const template = Handlebars.compile('{{calc "SUM(1, 2, 3, 4)"}}');
      expect(template({})).toBe('10');
    });
  });

  describe('context and scope', () => {
    it('should use template context variables', () => {
      const template = Handlebars.compile('{{calc "price * qty"}}');
      const result = template({ price: 10, qty: 3 });
      expect(result).toBe('30');
    });

    it('should use named arguments', () => {
      const template = Handlebars.compile('{{calc "a + b" a=5 b=3}}');
      expect(template({})).toBe('8');
    });

    it('should prioritize named arguments over context', () => {
      const template = Handlebars.compile('{{calc "x + y" x=10}}');
      const result = template({ x: 1, y: 2 });
      expect(result).toBe('12');
    });

    it('should handle complex real-world example', () => {
      const template = Handlebars.compile(
        '{{calc "ROUND((price * qty) * (1 - discount), 2)"}}',
      );
      const result = template({ price: 100, qty: 2, discount: 0.1 });
      expect(result).toBe('180');
    });
  });

  describe('error handling', () => {
    it('should throw error for invalid expressions', () => {
      const template = Handlebars.compile('{{calc "invalid expression"}}');
      expect(() => template({})).toThrow();
    });

    it('should use default value when provided', () => {
      const template = Handlebars.compile(
        '{{calc "invalid expression" default="-"}}',
      );
      expect(template({})).toBe('-');
    });

    it('should return empty string for null/undefined results', () => {
      const template = Handlebars.compile('{{calc "missingVar"}}');
      expect(template({})).toBe('');
    });
  });

  describe('README examples', () => {
    it('should handle all README examples correctly', () => {
      const context = {
        price: 10.99,
        qty: 3,
        discount: 0.15,
        fee: 5,
        shipping: 3.5,
        price1: 12.5,
        price2: 8.3,
        price3: 15.2,
      };

      const template1 = Handlebars.compile('{{calc "ROUND(price * qty, 2)"}}');
      expect(template1(context)).toBe('32.97');

      const template2 = Handlebars.compile(
        '{{calc "ROUND((price * qty) * (1 - discount), 2)"}}',
      );
      expect(template2(context)).toBe('28.02');

      const template3 = Handlebars.compile('{{calc "IF(qty > 10, 10, qty)"}}');
      expect(template3(context)).toBe('3');

      const template4 = Handlebars.compile(
        '{{calc "ROUND(a + b, 0)" a=fee b=shipping}}',
      );
      expect(template4(context)).toBe('9');

      const template5 = Handlebars.compile(
        '{{calc "MAX(price1, price2, price3)"}}',
      );
      expect(template5(context)).toBe('15.2');
    });
  });
});
