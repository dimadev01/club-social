import { dinero, toDecimal } from 'dinero.js';
import { ARS } from '@dinero.js/currencies';

export abstract class CurrencyUtils {
  public static toCents(value: number): number {
    return dinero({
      amount: Math.round(value * 100),
      currency: ARS,
    }).toJSON().amount;
  }

  public static formCents(value: number): number {
    return Math.round(value / 100);
  }

  public static format(amount: number): string {
    return toDecimal(
      dinero({ amount, currency: ARS }),
      ({ value, currency }) => `${currency.code} ${value}`
    );
  }
}
