import Handlebars from 'handlebars';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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

  describe('international number formats', () => {
    describe('European format (comma decimal, dot/space thousand)', () => {
      it('should handle European decimal format in context variables', () => {
        const template = Handlebars.compile('{{calc "price * qty"}}');
        const result = template({ price: '10,99', qty: 3 });
        expect(result).toBe('32.97');
      });

      it('should handle European thousand separators with dots', () => {
        const template = Handlebars.compile('{{calc "price + fee"}}');
        const result = template({ price: '1.234,56', fee: '500,44' });
        expect(result).toBe('1735');
      });

      it('should handle European thousand separators with spaces', () => {
        const template = Handlebars.compile('{{calc "total * rate"}}');
        const result = template({ total: '12 345,67', rate: '1,1' });
        expect(parseFloat(result)).toBeCloseTo(13580.237, 2);
      });

      it('should handle large European numbers', () => {
        const template = Handlebars.compile('{{calc "amount / 1000"}}');
        const result = template({ amount: '1.234.567,89' });
        expect(parseFloat(result)).toBeCloseTo(1234.56789, 5);
      });
    });

    describe('spreadsheet functions with international formats', () => {
      it('should work with SUM function', () => {
        const template = Handlebars.compile('{{calc "SUM(a, b, c)"}}');
        const result = template({
          a: '1.234,56',
          b: '2 345,67',
          c: '3.456,78',
        });
        expect(result).toBe('7037.01');
      });

      it('should work with AVERAGE function', () => {
        const template = Handlebars.compile(
          '{{calc "AVERAGE(price1, price2, price3)"}}',
        );
        const result = template({
          price1: '100,50',
          price2: '200,75',
          price3: '150,25',
        });
        expect(result).toBe('150.5');
      });

      it('should work with MAX function', () => {
        const template = Handlebars.compile('{{calc "MAX(val1, val2, val3)"}}');
        const result = template({
          val1: '1.234,56',
          val2: '2 345,67',
          val3: '1.000,00',
        });
        expect(result).toBe('2345.67');
      });
    });

    describe('edge cases', () => {
      it('should handle plain integers as strings', () => {
        const template = Handlebars.compile('{{calc "count * 2"}}');
        const result = template({ count: '5' });
        expect(result).toBe('10');
      });

      it('should handle already parsed numbers', () => {
        const template = Handlebars.compile('{{calc "price * qty"}}');
        const result = template({ price: 10.99, qty: 3 });
        expect(result).toBe('32.97');
      });

      it('should handle mixed number types', () => {
        const template = Handlebars.compile('{{calc "a + b + c"}}');
        const result = template({ a: '1.234,56', b: 1000, c: '500' });
        expect(result).toBe('2734.56');
      });
    });

    describe('nested variables', () => {
      it('should handle international numbers in nested object properties', () => {
        const template = Handlebars.compile(
          '{{#with product}}{{calc "price * quantity"}}{{/with}}',
        );
        const result = template({
          product: {
            price: '1.299,99',
            quantity: 3,
          },
        });
        expect(parseFloat(result)).toBeCloseTo(3899.97, 2);
      });

      it('should handle deeply nested international numbers', () => {
        const template = Handlebars.compile(
          '{{calc "order.items[0].price + order.items[0].tax"}}',
        );
        const result = template({
          order: {
            items: [
              {
                price: '2.450,80',
                tax: '490,16',
              },
            ],
          },
        });
        expect(parseFloat(result)).toBeCloseTo(2940.96, 2);
      });

      it('should handle international numbers with each helper', () => {
        const template = Handlebars.compile(
          '{{#each items}}{{calc "price * qty"}},{{/each}}',
        );
        const result = template({
          items: [
            { price: '10,50', qty: 2 },
            { price: '25,75', qty: 1 },
            { price: '1.500,00', qty: 3 },
          ],
        });
        const values = result
          .split(',')
          .filter((v) => v)
          .map((v) => parseFloat(v));
        expect(values[0]).toBeCloseTo(21, 1);
        expect(values[1]).toBeCloseTo(25.75, 2);
        expect(values[2]).toBeCloseTo(4500, 1);
      });

      it('should handle international numbers in array access', () => {
        const template = Handlebars.compile('{{calc "prices[0] + prices[1]"}}');
        const result = template({
          prices: ['1.234,56', '2.345,67'],
        });
        expect(parseFloat(result)).toBeCloseTo(3580.23, 2);
      });

      it('should handle mixed nested and flat international numbers', () => {
        const template = Handlebars.compile(
          '{{calc "basePrice + order.shipping + order.tax"}}',
        );
        const result = template({
          basePrice: '1.000,00',
          order: {
            shipping: '150,50',
            tax: '200,10',
          },
        });
        expect(parseFloat(result)).toBeCloseTo(1350.6, 2);
      });

      it('should handle international numbers with complex handlebars expressions', () => {
        const template = Handlebars.compile(
          '{{#if (calc "product.price > 1000")}}expensive{{else}}affordable{{/if}}',
        );
        const result1 = template({ product: { price: '1.500,00' } });
        const result2 = template({ product: { price: '500,00' } });
        expect(result1).toBe('expensive');
        expect(result2).toBe('affordable');
      });

      it('should convert international number using unary plus operator only', () => {
        const template = Handlebars.compile('{{calc "+price"}}');
        const result = template({ price: '1.234,56' });
        expect(result).toBe('1234.56');
      });

      it('should handle manual coercion using unary plus operator', () => {
        const template = Handlebars.compile('{{calc "+priceStr * qty"}}');
        const result = template({ priceStr: '1.234,56', qty: 2 });
        expect(parseFloat(result)).toBeCloseTo(2469.12, 2);
      });

      it('should handle mixed manual and automatic coercion', () => {
        const template = Handlebars.compile(
          '{{calc "+europeanPrice + usPrice + automaticPrice"}}',
        );
        const result = template({
          europeanPrice: '1.500,75', // Manual coercion with +
          usPrice: 250.25, // Already a number
          automaticPrice: '99,99', // Automatic coercion
        });
        expect(parseFloat(result)).toBeCloseTo(1850.99, 2);
      });

      it('should handle unary plus with nested properties', () => {
        const template = Handlebars.compile(
          '{{calc "+product.basePrice + product.tax"}}',
        );
        const result = template({
          product: {
            basePrice: '2.999,99', // Manual coercion
            tax: '600,00', // Automatic coercion
          },
        });
        expect(parseFloat(result)).toBeCloseTo(3599.99, 2);
      });
    });
  });

  describe('date functions', () => {
    beforeEach(() => {
      // Set a deterministic date for testing
      vi.setSystemTime(new Date('2025-09-26T12:00:00Z'));
    });

    describe('NOW and TODAY', () => {
      it('should handle NOW with deterministic time', () => {
        const template = Handlebars.compile('{{calc "NOW()"}}');
        expect(template({})).toBe('2025-09-26T12:00:00.000Z');
      });

      it('should handle TODAY with deterministic time', () => {
        const template = Handlebars.compile('{{calc "TODAY()"}}');
        expect(template({})).toBe('2025-09-26');
      });

      it('should handle timezone for TODAY', () => {
        vi.setSystemTime(new Date('2025-09-26T23:00:00Z'));
        const template = Handlebars.compile(
          '{{calc "TODAY(\\"Europe/Helsinki\\")"}}',
        );
        expect(template({})).toBe('2025-09-27');
      });

      it('should handle NOW and TODAY without parameters', () => {
        const nowTemplate = Handlebars.compile('{{calc "NOW()"}}');
        const todayTemplate = Handlebars.compile('{{calc "TODAY()"}}');

        expect(nowTemplate({})).toBe('2025-09-26T12:00:00.000Z');
        expect(todayTemplate({})).toBe('2025-09-26');
      });
    });

    describe('DATEADD', () => {
      it('should add days to a date', () => {
        const template = Handlebars.compile(
          '{{calc "DATEADD(startDate, daysToAdd, \\"days\\")"}}',
        );
        const result = template({
          startDate: '2025-09-26',
          daysToAdd: 14,
        });
        expect(result).toBe('2025-10-10');
      });

      it('should add months to a date', () => {
        const template = Handlebars.compile(
          '{{calc "DATEADD(date, value, \\"months\\")"}}',
        );
        const result = template({
          date: '2025-09-26',
          value: 2,
        });
        expect(result).toBe('2025-11-26');
      });

      it('should subtract years from a date', () => {
        const template = Handlebars.compile(
          '{{calc "DATEADD(date, yearsBack, \\"years\\")"}}',
        );
        const result = template({
          date: '2025-09-26',
          yearsBack: -1,
        });
        expect(result).toBe('2024-09-26');
      });

      it('should handle datetime inputs', () => {
        const template = Handlebars.compile(
          '{{calc "DATEADD(datetime, hours, \\"hours\\")"}}',
        );
        const result = template({
          datetime: '2025-09-26T12:00:00Z',
          hours: 2,
        });
        expect(result).toBe('2025-09-26T14:00:00.000Z');
      });

      it('should add hours to datetime string', () => {
        const template = Handlebars.compile(
          '{{calc "DATEADD(dt, 3, \\"hours\\")"}}',
        );
        const result = template({
          dt: '2025-09-26T10:30:00.000Z',
        });
        expect(result).toBe('2025-09-26T13:30:00.000Z');
      });

      it('should add minutes to datetime string', () => {
        const template = Handlebars.compile(
          '{{calc "DATEADD(dt, 45, \\"minutes\\")"}}',
        );
        const result = template({
          dt: '2025-09-26T10:30:00Z',
        });
        expect(result).toBe('2025-09-26T11:15:00.000Z');
      });

      it('should add seconds to datetime string', () => {
        const template = Handlebars.compile(
          '{{calc "DATEADD(dt, 30, \\"seconds\\")"}}',
        );
        const result = template({
          dt: '2025-09-26T10:30:00Z',
        });
        expect(result).toBe('2025-09-26T10:30:30.000Z');
      });

      it('should handle datetime with milliseconds', () => {
        const template = Handlebars.compile(
          '{{calc "DATEADD(dt, 2, \\"hours\\")"}}',
        );
        const result = template({
          dt: '2025-09-26T10:30:45.123Z',
        });
        expect(result).toBe('2025-09-26T12:30:45.123Z');
      });

      it('should preserve datetime format when adding days', () => {
        const template = Handlebars.compile(
          '{{calc "DATEADD(dt, 5, \\"days\\")"}}',
        );
        const result = template({
          dt: '2025-09-26T15:45:30Z',
        });
        expect(result).toBe('2025-10-01T15:45:30.000Z');
      });

      it('should handle datetime with timezone offset', () => {
        const template = Handlebars.compile(
          '{{calc "DATEADD(dt, 1, \\"days\\")"}}',
        );
        const result = template({
          dt: '2025-09-26T10:30:00+03:00',
        });
        expect(result).toBe('2025-09-27T07:30:00.000Z');
      });

      it('should handle negative values with datetime', () => {
        const template = Handlebars.compile(
          '{{calc "DATEADD(dt, -2, \\"hours\\")"}}',
        );
        const result = template({
          dt: '2025-09-26T10:30:00Z',
        });
        expect(result).toBe('2025-09-26T08:30:00.000Z');
      });
    });

    describe('DATEDIFF', () => {
      it('should calculate difference in days', () => {
        const template = Handlebars.compile(
          '{{calc "DATEDIFF(startDate, endDate, \\"days\\")"}}',
        );
        const result = template({
          startDate: '2025-09-26',
          endDate: '2025-10-10',
        });
        expect(result).toBe('14');
      });

      it('should calculate difference in months', () => {
        const template = Handlebars.compile(
          '{{calc "DATEDIFF(start, end, \\"months\\")"}}',
        );
        const result = template({
          start: '2025-01-01',
          end: '2025-03-01',
        });
        expect(result).toBe('2');
      });

      it('should handle negative differences', () => {
        const template = Handlebars.compile(
          '{{calc "DATEDIFF(laterDate, earlierDate, \\"days\\")"}}',
        );
        const result = template({
          laterDate: '2025-10-10',
          earlierDate: '2025-09-26',
        });
        expect(result).toBe('-14');
      });

      it('should calculate difference in hours between datetime strings', () => {
        const template = Handlebars.compile(
          '{{calc "DATEDIFF(start, end, \\"hours\\")"}}',
        );
        const result = template({
          start: '2025-09-26T10:00:00Z',
          end: '2025-09-26T15:30:00Z',
        });
        expect(result).toBe('5');
      });

      it('should calculate difference in minutes between datetime strings', () => {
        const template = Handlebars.compile(
          '{{calc "DATEDIFF(start, end, \\"minutes\\")"}}',
        );
        const result = template({
          start: '2025-09-26T10:00:00Z',
          end: '2025-09-26T10:45:00Z',
        });
        expect(result).toBe('45');
      });

      it('should calculate difference in seconds between datetime strings', () => {
        const template = Handlebars.compile(
          '{{calc "DATEDIFF(start, end, \\"seconds\\")"}}',
        );
        const result = template({
          start: '2025-09-26T10:00:00Z',
          end: '2025-09-26T10:00:30Z',
        });
        expect(result).toBe('30');
      });

      it('should handle datetime with milliseconds', () => {
        const template = Handlebars.compile(
          '{{calc "DATEDIFF(start, end, \\"seconds\\")"}}',
        );
        const result = template({
          start: '2025-09-26T10:00:00.123Z',
          end: '2025-09-26T10:00:05.456Z',
        });
        expect(result).toBe('5');
      });

      it('should calculate days between datetime strings', () => {
        const template = Handlebars.compile(
          '{{calc "DATEDIFF(start, end, \\"days\\")"}}',
        );
        const result = template({
          start: '2025-09-26T10:30:00Z',
          end: '2025-09-28T15:45:00Z',
        });
        expect(result).toBe('2');
      });

      it('should handle mixed date and datetime formats', () => {
        const template = Handlebars.compile(
          '{{calc "DATEDIFF(date, datetime, \\"hours\\")"}}',
        );
        const result = template({
          date: '2025-09-26',
          datetime: '2025-09-26T15:30:00Z',
        });
        expect(result).toBe('15');
      });

      it('should handle datetime with timezone offsets', () => {
        const template = Handlebars.compile(
          '{{calc "DATEDIFF(dt1, dt2, \\"hours\\")"}}',
        );
        const result = template({
          dt1: '2025-09-26T10:00:00+03:00',
          dt2: '2025-09-26T10:00:00Z',
        });
        expect(result).toBe('3');
      });

      it('should handle negative differences with datetime', () => {
        const template = Handlebars.compile(
          '{{calc "DATEDIFF(later, earlier, \\"hours\\")"}}',
        );
        const result = template({
          later: '2025-09-26T15:00:00Z',
          earlier: '2025-09-26T10:00:00Z',
        });
        expect(result).toBe('-5');
      });
    });

    describe('Component extraction', () => {
      it('should extract YEAR from date', () => {
        const template = Handlebars.compile('{{calc "YEAR(date)"}}');
        const result = template({ date: '2025-09-26' });
        expect(result).toBe('2025');
      });

      it('should extract YEAR from datetime', () => {
        const template = Handlebars.compile('{{calc "YEAR(datetime)"}}');
        const result = template({ datetime: '2025-09-26T14:30:45Z' });
        expect(result).toBe('2025');
      });

      it('should extract MONTH from date', () => {
        const template = Handlebars.compile('{{calc "MONTH(date)"}}');
        const result = template({ date: '2025-09-26' });
        expect(result).toBe('9');
      });

      it('should extract MONTH from datetime', () => {
        const template = Handlebars.compile('{{calc "MONTH(datetime)"}}');
        const result = template({ datetime: '2025-12-26T14:30:45Z' });
        expect(result).toBe('12');
      });

      it('should extract DAY from date', () => {
        const template = Handlebars.compile('{{calc "DAY(date)"}}');
        const result = template({ date: '2025-09-26' });
        expect(result).toBe('26');
      });

      it('should extract DAY from datetime', () => {
        const template = Handlebars.compile('{{calc "DAY(datetime)"}}');
        const result = template({ datetime: '2025-09-15T14:30:45Z' });
        expect(result).toBe('15');
      });

      it('should extract HOUR from datetime', () => {
        const template = Handlebars.compile('{{calc "HOUR(datetime)"}}');
        const result = template({ datetime: '2025-09-26T14:30:45Z' });
        expect(result).toBe('14');
      });

      it('should extract HOUR from datetime with milliseconds', () => {
        const template = Handlebars.compile('{{calc "HOUR(datetime)"}}');
        const result = template({ datetime: '2025-09-26T09:30:45.123Z' });
        expect(result).toBe('9');
      });

      it('should extract MINUTE from datetime', () => {
        const template = Handlebars.compile('{{calc "MINUTE(datetime)"}}');
        const result = template({ datetime: '2025-09-26T14:30:45Z' });
        expect(result).toBe('30');
      });

      it('should extract MINUTE from datetime with milliseconds', () => {
        const template = Handlebars.compile('{{calc "MINUTE(datetime)"}}');
        const result = template({ datetime: '2025-09-26T14:05:45.123Z' });
        expect(result).toBe('5');
      });

      it('should extract SECOND from datetime', () => {
        const template = Handlebars.compile('{{calc "SECOND(datetime)"}}');
        const result = template({ datetime: '2025-09-26T14:30:45Z' });
        expect(result).toBe('45');
      });

      it('should extract SECOND from datetime with milliseconds', () => {
        const template = Handlebars.compile('{{calc "SECOND(datetime)"}}');
        const result = template({ datetime: '2025-09-26T14:30:08.123Z' });
        expect(result).toBe('8');
      });

      it('should handle datetime with timezone offset for extraction', () => {
        const template = Handlebars.compile('{{calc "HOUR(datetime)"}}');
        const result = template({ datetime: '2025-09-26T14:30:45+03:00' });
        expect(result).toBe('11');
      });

      it('should extract components from mixed formats', () => {
        const yearTemplate = Handlebars.compile('{{calc "YEAR(dt)"}}');
        const monthTemplate = Handlebars.compile('{{calc "MONTH(dt)"}}');
        const dayTemplate = Handlebars.compile('{{calc "DAY(dt)"}}');

        const dateContext = { dt: '2025-06-15' };
        const datetimeContext = { dt: '2025-06-15T10:30:00Z' };

        expect(yearTemplate(dateContext)).toBe('2025');
        expect(yearTemplate(datetimeContext)).toBe('2025');

        expect(monthTemplate(dateContext)).toBe('6');
        expect(monthTemplate(datetimeContext)).toBe('6');

        expect(dayTemplate(dateContext)).toBe('15');
        expect(dayTemplate(datetimeContext)).toBe('15');
      });
    });

    describe('WEEKDAY', () => {
      it('should return ISO weekday by default (Monday=1)', () => {
        // 2025-09-28 is a Sunday
        const template = Handlebars.compile('{{calc "WEEKDAY(date)"}}');
        const result = template({ date: '2025-09-28' });
        expect(result).toBe('7');
      });

      it('should handle Excel convention (Sunday=1)', () => {
        // 2025-09-28 is a Sunday
        const template = Handlebars.compile('{{calc "WEEKDAY(date, 1)"}}');
        const result = template({ date: '2025-09-28' });
        expect(result).toBe('1');
      });

      it('should handle Monday=0 convention', () => {
        // 2025-09-29 is a Monday
        const template = Handlebars.compile('{{calc "WEEKDAY(date, 3)"}}');
        const result = template({ date: '2025-09-29' });
        expect(result).toBe('0');
      });

      it('should handle datetime strings', () => {
        // 2025-09-28 is a Sunday
        const template = Handlebars.compile('{{calc "WEEKDAY(datetime)"}}');
        const result = template({ datetime: '2025-09-28T10:30:00Z' });
        expect(result).toBe('7');
      });

      it('should handle datetime with different conventions', () => {
        // 2025-09-29 is a Monday
        const template1 = Handlebars.compile('{{calc "WEEKDAY(dt, 1)"}}');
        const template2 = Handlebars.compile('{{calc "WEEKDAY(dt, 2)"}}');
        const template3 = Handlebars.compile('{{calc "WEEKDAY(dt, 3)"}}');

        const context = { dt: '2025-09-29T15:45:00Z' };

        expect(template1(context)).toBe('2'); // Excel: Monday = 2
        expect(template2(context)).toBe('1'); // ISO: Monday = 1
        expect(template3(context)).toBe('0'); // Monday = 0
      });
    });

    describe('WEEKNUM', () => {
      it('should return ISO week number', () => {
        const template = Handlebars.compile('{{calc "WEEKNUM(date)"}}');
        const result = template({ date: '2025-01-06' });
        expect(result).toBe('2');
      });

      it('should handle different week numbering types', () => {
        const template = Handlebars.compile(
          '{{calc "WEEKNUM(date, \\"ISO\\")"}}',
        );
        const result = template({ date: '2025-01-06' });
        expect(result).toBe('2');
      });

      it('should handle datetime strings', () => {
        const template = Handlebars.compile('{{calc "WEEKNUM(datetime)"}}');
        const result = template({ datetime: '2025-01-06T10:30:00Z' });
        expect(result).toBe('2');
      });

      it('should handle datetime with timezone', () => {
        const template = Handlebars.compile('{{calc "WEEKNUM(dt, 2)"}}');
        const result = template({ dt: '2025-01-06T10:30:00+02:00' });
        expect(result).toBe('2');
      });
    });

    describe('non-standard date format parsing', () => {
      describe('German format (DD.MM.YYYY)', () => {
        it('should parse German date format', () => {
          const template = Handlebars.compile('{{calc "YEAR(date)"}}');
          const result = template({ date: '30.09.2025' });
          expect(result).toBe('2025');
        });

        it('should parse German datetime format', () => {
          const template = Handlebars.compile('{{calc "HOUR(datetime)"}}');
          const result = template({ datetime: '30.09.2025 11:34' });
          expect(result).toBe('11');
        });

        it('should parse German datetime with seconds', () => {
          const template = Handlebars.compile('{{calc "SECOND(datetime)"}}');
          const result = template({ datetime: '30.09.2025 11:34:56' });
          expect(result).toBe('56');
        });

        it('should add days to German date', () => {
          const template = Handlebars.compile(
            '{{calc "DATEADD(date, 5, \\"days\\")"}}',
          );
          const result = template({ date: '30.09.2025' });
          expect(result).toBe('2025-10-05');
        });

        it('should add hours to German datetime', () => {
          const template = Handlebars.compile(
            '{{calc "DATEADD(datetime, 2, \\"hours\\")"}}',
          );
          const result = template({ datetime: '30.09.2025 11:34' });
          expect(result).toBe('2025-09-30T13:34:00.000Z');
        });

        it('should calculate difference between German dates', () => {
          const template = Handlebars.compile(
            '{{calc "DATEDIFF(start, end, \\"days\\")"}}',
          );
          const result = template({
            start: '25.09.2025',
            end: '30.09.2025',
          });
          expect(result).toBe('5');
        });

        it('should handle mixed German and ISO formats', () => {
          const template = Handlebars.compile(
            '{{calc "DATEDIFF(germanDate, isoDate, \\"days\\")"}}',
          );
          const result = template({
            germanDate: '25.09.2025',
            isoDate: '2025-09-30',
          });
          expect(result).toBe('5');
        });
      });

      describe('European format with slashes (DD/MM/YYYY)', () => {
        it('should parse European date format', () => {
          const template = Handlebars.compile('{{calc "MONTH(date)"}}');
          const result = template({ date: '15/06/2025' });
          expect(result).toBe('6');
        });

        it('should parse European datetime format', () => {
          const template = Handlebars.compile('{{calc "MINUTE(datetime)"}}');
          const result = template({ datetime: '15/06/2025 14:30' });
          expect(result).toBe('30');
        });

        it('should add months to European date', () => {
          const template = Handlebars.compile(
            '{{calc "DATEADD(date, 2, \\"months\\")"}}',
          );
          const result = template({ date: '15/06/2025' });
          expect(result).toBe('2025-08-15');
        });
      });

      describe('US format (MM/DD/YYYY)', () => {
        it('should parse US date format when day > 12', () => {
          const template = Handlebars.compile('{{calc "DAY(date)"}}');
          const result = template({ date: '06/15/2025' });
          expect(result).toBe('15');
        });

        it('should parse US datetime format', () => {
          const template = Handlebars.compile('{{calc "MONTH(datetime)"}}');
          const result = template({ datetime: '06/15/2025 10:30' });
          expect(result).toBe('6');
        });
      });

      describe('Asian format (YYYY/MM/DD)', () => {
        it('should parse Asian date format', () => {
          const template = Handlebars.compile('{{calc "DAY(date)"}}');
          const result = template({ date: '2025/09/30' });
          expect(result).toBe('30');
        });

        it('should parse Asian datetime format', () => {
          const template = Handlebars.compile('{{calc "HOUR(datetime)"}}');
          const result = template({ datetime: '2025/09/30 15:45' });
          expect(result).toBe('15');
        });
      });

      describe('real-world epilot examples', () => {
        it('should handle epilot German datetime in calculations', () => {
          const template = Handlebars.compile(
            '{{calc "DATEDIFF(created, updated, \\"hours\\")"}}',
          );
          const result = template({
            created: '30.09.2025 11:34',
            updated: '30.09.2025 15:45',
          });
          expect(result).toBe('4');
        });

        it('should add business days to German date', () => {
          const template = Handlebars.compile(
            '{{calc "DATEADD(startDate, 7, \\"days\\")"}}',
          );
          const result = template({
            startDate: '30.09.2025',
          });
          expect(result).toBe('2025-10-07');
        });

        it('should extract year from epilot datetime', () => {
          const template = Handlebars.compile('{{calc "YEAR(createdAt)"}}');
          const result = template({
            createdAt: '15.03.2024 09:30:45',
          });
          expect(result).toBe('2024');
        });
      });
    });

    describe('error handling', () => {
      it('should throw error for invalid dates', () => {
        const template = Handlebars.compile('{{calc "YEAR(invalidDate)"}}');
        expect(() => template({ invalidDate: 'invalid' })).toThrow();
      });

      it('should throw error for invalid units', () => {
        const template = Handlebars.compile(
          '{{calc "DATEADD(date, value, \\"invalid\\")"}}',
        );
        expect(() => template({ date: '2025-09-26', value: 1 })).toThrow();
      });
    });

    describe('timezone handling with datetime strings', () => {
      it('should handle timezone in NOW function', () => {
        const utcTemplate = Handlebars.compile('{{calc "NOW()"}}');
        const tokyoTemplate = Handlebars.compile('{{calc "NOW(\\"Asia/Tokyo\\")"}}');

        const utcResult = utcTemplate({});
        const tokyoResult = tokyoTemplate({});

        expect(utcResult).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        expect(tokyoResult).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}\+09:00$/);
      });

      it('should handle timezone conversion in datetime operations', () => {
        const template = Handlebars.compile(
          '{{calc "DATEADD(dt, 1, \\"days\\", \\"Europe/London\\")"}}',
        );
        const result = template({
          dt: '2025-09-26T23:00:00Z',
        });
        expect(result).toMatch(/2025-09-28T00:00:00/);
      });

      it('should calculate time differences across timezones', () => {
        const template = Handlebars.compile(
          '{{calc "DATEDIFF(utcTime, localTime, \\"hours\\")"}}',
        );
        const result = template({
          utcTime: '2025-09-26T12:00:00Z',
          localTime: '2025-09-26T12:00:00-05:00',
        });
        expect(result).toBe('5');
      });

      it('should extract components with timezone consideration', () => {
        const hourTemplate = Handlebars.compile('{{calc "HOUR(dt, \\"America/New_York\\")"}}');
        const result = hourTemplate({
          dt: '2025-09-26T00:00:00Z'
        });
        expect(result).toBe('20'); // 00:00 UTC is 20:00 previous day in NY (EDT)
      });
    });

    describe('real-world examples', () => {
      it('should calculate age in years', () => {
        const template = Handlebars.compile(
          '{{calc "DATEDIFF(birthdate, TODAY(), \\"years\\")"}}',
        );
        const result = template({ birthdate: '1990-09-26' });
        expect(result).toBe('35');
      });

      it('should calculate days until deadline', () => {
        const template = Handlebars.compile(
          '{{calc "DATEDIFF(TODAY(), deadline, \\"days\\")"}}',
        );
        const result = template({ deadline: '2025-10-10' });
        expect(result).toBe('14');
      });

      it('should get end of current month', () => {
        vi.setSystemTime(new Date('2025-09-15T00:00:00Z'));
        const template = Handlebars.compile(
          '{{calc "DATEADD(DATEADD(TODAY(), 1, \\"months\\"), -DAY(DATEADD(TODAY(), 1, \\"months\\")), \\"days\\")"}}',
        );
        expect(template({})).toBe('2025-09-30');
      });

      it('should calculate business hours between datetimes', () => {
        const template = Handlebars.compile(
          '{{calc "DATEDIFF(startTime, endTime, \\"hours\\")"}}',
        );
        const result = template({
          startTime: '2025-09-26T09:00:00Z',
          endTime: '2025-09-26T17:30:00Z',
        });
        expect(result).toBe('8');
      });

      it('should handle meeting scheduling with datetime', () => {
        const template = Handlebars.compile(
          '{{calc "DATEADD(meetingStart, duration, \\"minutes\\")"}}',
        );
        const result = template({
          meetingStart: '2025-09-26T14:00:00Z',
          duration: 90,
        });
        expect(result).toBe('2025-09-26T15:30:00.000Z');
      });

      it('should calculate time remaining with datetime precision', () => {
        vi.setSystemTime(new Date('2025-09-26T10:30:00Z'));
        const template = Handlebars.compile(
          '{{calc "DATEDIFF(NOW(), eventTime, \\"minutes\\")"}}',
        );
        const result = template({
          eventTime: '2025-09-26T15:00:00Z',
        });
        expect(result).toBe('270');
      });
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
