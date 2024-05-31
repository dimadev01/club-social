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
    let amount: number;

    if (decimals) {
      amount = this.toNumber();
    } else {
      amount = this.toInteger();
    }

    const amountFormatted = new Intl.NumberFormat('es-AR').format(amount);

    if (currency) {
      return `${ARS.code} ${amountFormatted}`;
    }

    return amountFormatted;
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
    return +toDecimal(this._value);
  }

  public toInteger(): number {
    return +this.toNumber().toFixed(0);
  }
}
