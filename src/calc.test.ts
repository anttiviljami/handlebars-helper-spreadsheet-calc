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
          c: '3.456,78'
        });
        expect(result).toBe('7037.01');
      });

      it('should work with AVERAGE function', () => {
        const template = Handlebars.compile('{{calc "AVERAGE(price1, price2, price3)"}}');
        const result = template({
          price1: '100,50',
          price2: '200,75',
          price3: '150,25'
        });
        expect(result).toBe('150.5');
      });

      it('should work with MAX function', () => {
        const template = Handlebars.compile('{{calc "MAX(val1, val2, val3)"}}');
        const result = template({
          val1: '1.234,56',
          val2: '2 345,67',
          val3: '1.000,00'
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
        const template = Handlebars.compile('{{#with product}}{{calc "price * quantity"}}{{/with}}');
        const result = template({
          product: {
            price: '1.299,99',
            quantity: 3
          }
        });
        expect(parseFloat(result)).toBeCloseTo(3899.97, 2);
      });

      it('should handle deeply nested international numbers', () => {
        const template = Handlebars.compile('{{calc "order.items[0].price + order.items[0].tax"}}');
        const result = template({
          order: {
            items: [{
              price: '2.450,80',
              tax: '490,16'
            }]
          }
        });
        expect(parseFloat(result)).toBeCloseTo(2940.96, 2);
      });

      it('should handle international numbers with each helper', () => {
        const template = Handlebars.compile('{{#each items}}{{calc "price * qty"}},{{/each}}');
        const result = template({
          items: [
            { price: '10,50', qty: 2 },
            { price: '25,75', qty: 1 },
            { price: '1.500,00', qty: 3 }
          ]
        });
        const values = result.split(',').filter(v => v).map(v => parseFloat(v));
        expect(values[0]).toBeCloseTo(21, 1);
        expect(values[1]).toBeCloseTo(25.75, 2);
        expect(values[2]).toBeCloseTo(4500, 1);
      });

      it('should handle international numbers in array access', () => {
        const template = Handlebars.compile('{{calc "prices[0] + prices[1]"}}');
        const result = template({
          prices: ['1.234,56', '2.345,67']
        });
        expect(parseFloat(result)).toBeCloseTo(3580.23, 2);
      });

      it('should handle mixed nested and flat international numbers', () => {
        const template = Handlebars.compile('{{calc "basePrice + order.shipping + order.tax"}}');
        const result = template({
          basePrice: '1.000,00',
          order: {
            shipping: '150,50',
            tax: '200,10'
          }
        });
        expect(parseFloat(result)).toBeCloseTo(1350.6, 2);
      });

      it('should handle international numbers with complex handlebars expressions', () => {
        const template = Handlebars.compile('{{#if (calc "product.price > 1000")}}expensive{{else}}affordable{{/if}}');
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
        const template = Handlebars.compile('{{calc "+europeanPrice + usPrice + automaticPrice"}}');
        const result = template({
          europeanPrice: '1.500,75',  // Manual coercion with +
          usPrice: 250.25,            // Already a number
          automaticPrice: '99,99'     // Automatic coercion
        });
        expect(parseFloat(result)).toBeCloseTo(1850.99, 2);
      });

      it('should handle unary plus with nested properties', () => {
        const template = Handlebars.compile('{{calc "+product.basePrice + product.tax"}}');
        const result = template({
          product: {
            basePrice: '2.999,99',  // Manual coercion
            tax: '600,00'           // Automatic coercion
          }
        });
        expect(parseFloat(result)).toBeCloseTo(3599.99, 2);
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
