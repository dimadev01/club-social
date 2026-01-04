import { NumberFormatOptions, NumberParser } from '@internationalized/number';

const locale = 'es-AR';

const parser = (opts: NumberFormatOptions) => new NumberParser(locale, opts);

const formatter = (opts: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat(locale, opts);

export const NumberFormat = {
  currency(value: number, options: Intl.NumberFormatOptions = {}): string {
    return formatter({
      currency: 'ARS',
      currencySign: 'standard',
      maximumFractionDigits: 0,
      signDisplay: 'auto',
      style: 'currency',
      ...options,
    }).format(value);
  },

  currencyCents(value: number, options: Intl.NumberFormatOptions = {}): string {
    return NumberFormat.currency(value / 100, options);
  },

  decimal(value: number, fractionDigits = 2): string {
    return formatter({ maximumFractionDigits: fractionDigits }).format(value);
  },

  format(value: number, options: Intl.NumberFormatOptions = {}): string {
    return formatter(options).format(value);
  },

  fromCents(value: number): number {
    return value / 100;
  },

  parse(formatted: string, options: NumberFormatOptions = {}): number {
    return parser(options).parse(formatted);
  },

  toCents(value: number): number {
    return Math.round(value * 100);
  },
};
