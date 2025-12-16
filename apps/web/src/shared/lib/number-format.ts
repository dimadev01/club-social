import { NumberParser } from '@internationalized/number';

const locale = 'es-AR';
const parser = new NumberParser(locale);

const formatter = (opts: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat(locale, opts);

export const NumberFormat = {
  decimal(value: number, fractionDigits = 2) {
    return formatter({ maximumFractionDigits: fractionDigits }).format(value);
  },

  format(
    value: number,
    options: Intl.NumberFormatOptions = {
      // currency: 'ARS',
      // maximumFractionDigits: 0,
      // style: 'currency',
    },
  ) {
    return formatter(options).format(value);
  },

  parse(formatted: string): number {
    return parser.parse(formatted);
  },
};
