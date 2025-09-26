# handlebars-helper-spreadsheet-calc

[![CI](https://github.com/anttiviljami/handlebars-helper-spreadsheet-calc/workflows/CI/badge.svg)](https://github.com/anttiviljami/handlebars-helper-spreadsheet-calc/actions?query=workflow%3ACI)
[![npm version](https://img.shields.io/npm/v/handlebars-helper-spreadsheet-calc.svg)](https://www.npmjs.com/package/handlebars-helper-spreadsheet-calc)
[![npm downloads](https://img.shields.io/npm/dw/handlebars-helper-spreadsheet-calc)](https://www.npmjs.com/package/handlebars-helper-spreadsheet-calc)
[![License](http://img.shields.io/:license-mit-blue.svg)](https://github.com/anttiviljami/handlebars-helper-spreadsheet-calc/blob/master/LICENSE)
[![Buy me a coffee](https://img.shields.io/badge/donate-buy%20me%20a%20coffee-orange)](https://buymeacoff.ee/anttiviljami)

Handlebars helper to run spreadsheet-style formulas.

## Usage

```
Price: {{price}}
Qty: {{qty}}

Total (rounded 2): {{ calc "ROUND(price * qty, 2)" }}
Discounted: {{ calc "ROUND((price * qty) * (1 - discount), 2)" }}

Caps with IF: {{ calc "IF(qty > 10, 10, qty)" }}

Using named args override:
{{ calc "ROUND(a + b, 0)" a=fee b=shipping }}

Min/Max:
{{ calc "MAX(price1, price2, price3)" }}
```

## Installation

```
npm install handlebars-helper-spreadsheet-calc
```

```js
import Handlebars from "handlebars";
import calc from "handlebars-helper-spreadsheet-calc";

Handlebars.registerHelper("calc", calc);
```

## Available spreadsheet-style formulas

### Arithmetic operators

- `+` - Addition
- `-` - Subtraction
- `*` - Multiplication
- `/` - Division
- `^` - Exponentiation
- `%` - Modulus (remainder of division)
- `()` - Parentheses for grouping expressions
- `-number` - Negation (unary minus)

### Formula functions

- `ABS(number)` - Returns the absolute value of a number.
- `AND(condition1, condition2, ...)` - Returns `true` if all conditions are truthy.
- `AVERAGE(number1, number2, ...)` - Returns the average of a set of numbers.
- `CEIL(number)` - Rounds a number up to the nearest integer.
- `FLOOR(number)` - Rounds a number down to the nearest integer.
- `IF(condition, value_if_true, value_if_false)` - Returns one value if condition is truthy and another value if it's falsey.
- `MAX(number1, number2, ...)` - Returns the largest number in a set of numbers.
- `MIN(number1, number2, ...)` - Returns the smallest number in a set of numbers.
- `NOT(condition)` - Reverses the value of its argument. Returns `true` if its argument is truthy and `false` if its argument is falsey.
- `OR(condition1, condition2, ...)` - Returns `true` if any condition is truthy.
- `ROUND(number, [places])` - Rounds a number to a specified number of decimal places. If places is omitted, it defaults to 0.
- `SUM(number1, number2, ...)` - Returns the sum of a set of numbers.
- `RAND()` - Returns a random number between 0 (inclusive) and 1 (exclusive).

### Date functions

All date functions work with ISO 8601 date strings (e.g., "2025-09-26" or "2025-09-26T12:00:00Z") and use UTC by default with optional timezone support.

#### Current time
- `NOW([timezone])` - Returns the current date and time in ISO format (e.g., "2025-09-26T12:00:00.000Z")
- `TODAY([timezone])` - Returns the current date in ISO format (e.g., "2025-09-26")

#### Date arithmetic
- `DATEADD(date, value, unit, [timezone])` - Adds/subtracts time from a date
  - Units: "years", "quarters", "months", "weeks", "days", "hours", "minutes", "seconds"
- `DATEDIFF(start_date, end_date, unit, [timezone])` - Calculates difference between dates
  - Returns floor of the difference (e.g., 1.9 months = 1)

#### Date components
- `YEAR(date, [timezone])` - Extract year (e.g., 2025)
- `MONTH(date, [timezone])` - Extract month (1-12)
- `DAY(date, [timezone])` - Extract day of month (1-31)
- `HOUR(date, [timezone])` - Extract hour (0-23)
- `MINUTE(date, [timezone])` - Extract minute (0-59)
- `SECOND(date, [timezone])` - Extract second (0-59)
- `WEEKDAY(date, [type], [timezone])` - Get day of week
  - `type=1`: Sunday=1, Saturday=7 (Excel default)
  - `type=2` or omitted: Monday=1, Sunday=7 (ISO)
  - `type=3`: Monday=0, Sunday=6

#### Week calculations
- `WEEKNUM(date, [type], [timezone])` - Get ISO week number of the year

#### Examples

```handlebars
<!-- Add 14 days to order date -->
Delivery date: {{ calc "DATEADD(order.date, 14, \"days\")" }}

<!-- Calculate age -->
Age: {{ calc "DATEDIFF(birthDate, TODAY(), \"years\")" }} years old

<!-- Extract components -->
Year: {{ calc "YEAR(invoice.date)" }}
Month: {{ calc "MONTH(invoice.date)" }}

<!-- Business logic -->
Due date: {{ calc "DATEADD(invoice.date, payment.terms, \"days\")" }}
Overdue: {{ calc "DATEDIFF(invoice.dueDate, TODAY(), \"days\") < 0" }}

<!-- Timezone handling -->
Local date: {{ calc "TODAY(\"Europe/Helsinki\")" }}
```
