import { ARS as dineroARS, USD as dineroUSD } from '@dinero.js/currencies';
import {
  Dinero,
  dinero,
  greaterThanOrEqual,
  subtract,
  toDecimal,
  toSnapshot,
} from 'dinero.js';

import { CurrencyEnum } from '@domain/common/enums/currency.enum';
import { ValueObject } from '@domain/common/value-objects/value-object';

interface FormatOptions {
  currency?: boolean;
  decimals?: boolean;
  minimumFractionDigits?: number;
}

interface InternalMoneyProps {
  currency: CurrencyEnum;
  dinero: Dinero<number>;
}

interface MoneyProps {
  amount: number;
  currency?: CurrencyEnum;
}

export class Money extends ValueObject<InternalMoneyProps> {
  public constructor({ amount, currency = CurrencyEnum.ARS }: MoneyProps) {
    super({
      currency,
      dinero: dinero({
        amount,
        currency: Money.getDineroCurrency(currency),
      }),
    });
  }

  public get value(): number {
    return toSnapshot(this.props.dinero).amount;
  }

  public static fromNumber(
    amount: number,
    currency: CurrencyEnum = CurrencyEnum.ARS,
  ): Money {
    return new Money({ amount: amount * 100, currency });
  }

  public format({
    currency = false,
    decimals = false,
    minimumFractionDigits = 2,
  }: FormatOptions = {}): string {
    const options: Intl.NumberFormatOptions = {
      currency: this.props.currency,
      minimumFractionDigits: decimals ? minimumFractionDigits : 0,
    };

    const amount = decimals ? this.toNumber() : this.toInteger();

    if (currency) {
      options.style = 'currency';
    } else if (decimals) {
      options.style = 'decimal';
    }

    const amountFormatted = new Intl.NumberFormat(
      this._getIntlLocale(),
      options,
    ).format(amount);

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

  public isGreaterThanOrEqual(value: Money) {
    return greaterThanOrEqual(this.props.dinero, value.props.dinero);
  }

  public subtract(value: Money): Money {
    const result = subtract(this.props.dinero, value.props.dinero);

    return new Money({
      amount: toSnapshot(result).amount,
      currency: this.props.currency,
    });
  }

  public toInteger(): number {
    return Math.round(this.toNumber());
  }

  public toNumber(): number {
    return +toDecimal(this.props.dinero);
  }

  private static getDineroCurrency(currency: CurrencyEnum) {
    switch (currency) {
      case CurrencyEnum.ARS:
        return dineroARS;

      case CurrencyEnum.USD:
        return dineroUSD;

      default:
        throw new Error('Currency not supported');
    }
  }

  private _getIntlLocale(): string {
    switch (this.props.currency) {
      case CurrencyEnum.ARS:
        return 'es-AR';

      case CurrencyEnum.USD:
        return 'en-US';

      default:
        throw new Error('Currency not supported');
    }
  }
}
