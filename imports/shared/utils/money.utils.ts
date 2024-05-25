import { dinero, toDecimal, type Dinero } from 'dinero.js';
import { ARS } from '@dinero.js/currencies';

export abstract class MoneyUtils {
  public static createDinero(amount: number): Dinero<number> {
    return dinero({ amount, currency: ARS });
  }

  public static formatCents(amount: number): string {
    const amountAsDinero = this.createDinero(amount);

    return toDecimal(
      amountAsDinero,
      ({ value }) => `$ ${new Intl.NumberFormat('es-AR').format(Number(value))}`
    );
  }

  public static formatWithCurrency(amount: number): string {
    return this.formatCents(this.toCents(amount));
  }

  public static fromCents(value: number): number {
    return +toDecimal(this.createDinero(value));
  }

  public static toCents(value: number): number {
    const amount = Math.round(value * 100);

    return this.createDinero(amount).toJSON().amount;
  }
}
