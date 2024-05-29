import { ARS } from '@dinero.js/currencies';
import { Dinero, dinero, toDecimal } from 'dinero.js';

interface FormatOptions {
  currency?: boolean;
  decimals?: boolean;
}

export class Money {
  private _value: Dinero<number>;

  public constructor(cents: number) {
    this._value = dinero({ amount: cents, currency: ARS });
  }

  public format({
    currency = false,
    decimals = false,
  }: FormatOptions = {}): string {
    let amount = toDecimal(this._value);

    if (!decimals) {
      amount = Number(amount).toFixed(0);
    }

    amount = new Intl.NumberFormat('es-AR').format(Number(amount));

    if (currency) {
      return `${ARS.code} ${amount}`;
    }

    return amount;
  }

  public formatWithCurrency(): string {
    return this.format({ currency: true });
  }

  public formatWithCurrencyAndDecimals(): string {
    return this.format({ currency: true, decimals: true });
  }

  public formatWithDecimals(): string {
    return this.format({ decimals: true });
  }

  public toNumber(): number {
    return +this.format({ decimals: true });
  }
}
