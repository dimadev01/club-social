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

  formatCents(value: number): string {
    return formatter({
      currency: 'ARS',
      maximumFractionDigits: 0,
      style: 'currency',
    }).format(Math.round(value / 100));
  },

  parse(formatted: string): null | number {
    return parser.parse(formatted);
  },

  toCents(value: number): number {
    return Math.round(value * 100);
  },
};
