import { dinero, toDecimal, toUnits } from 'dinero.js';
import { ARS } from '@dinero.js/currencies';

export abstract class CurrencyUtils {
  public static toCents(value: number): number {
    return dinero({
      amount: Math.round(value * 100),
      currency: ARS,
    }).toJSON().amount;
  }

  public static fromCents(value: number): number {
    return Math.round(value / 100);
  }

  public static formatCents(amount: number, decimals = true): string {
    if (decimals) {
      return toDecimal(
        dinero({ amount, currency: ARS }),
        ({ value, currency }) => `${currency.code} ${value}`
      );
    }

    return toUnits(
      dinero({ amount, currency: ARS }),
      ({ value, currency }) => `${currency.code} ${value[0]}`
    );
  }

  public static format(amount: number, decimals = true): string {
    return this.formatCents(this.toCents(amount), decimals);
  }
}
