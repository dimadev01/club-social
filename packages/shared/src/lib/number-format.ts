import { NumberParser } from '@internationalized/number';

const locale = 'es-AR';
const parser = new NumberParser(locale);

const formatter = (opts: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat(locale, opts);

export const NumberFormat = {
  decimal(value: number, fractionDigits = 2): string {
    return formatter({ maximumFractionDigits: fractionDigits }).format(value);
  },

  format(value: number, options: Intl.NumberFormatOptions = {}): string {
    return formatter(options).format(value);
  },

  formatCurrency(value: number): string {
    return formatter({
      currency: 'ARS',
      currencySign: 'standard',
      maximumFractionDigits: 0,
      signDisplay: 'auto',
      style: 'currency',
    }).format(value);
  },

  formatCurrencyCents(value: number): string {
    return NumberFormat.formatCurrency(Math.round(value / 100));
  },

  fromCents(value: number): number {
    return value / 100;
  },

  parse(formatted: string): number {
    return parser.parse(formatted);
  },

  toCents(value: number): number {
    return Math.round(value * 100);
  },
};
