import {
  Currency,
  ARS as dineroARS,
  USD as dineroUSD,
} from '@dinero.js/currencies';
import {
  Dinero,
  add,
  dinero,
  equal,
  greaterThan,
  greaterThanOrEqual,
  isNegative,
  isZero,
  lessThan,
  lessThanOrEqual,
  subtract,
  toDecimal,
  toSnapshot,
} from 'dinero.js';

import { CurrencyEnum } from '@domain/common/enums/currency.enum';
import { ValueObject } from '@domain/common/value-objects/value-object';

interface CreateMoney {
  amount: number;
  currency?: CurrencyEnum;
}

interface FormatOptions {
  currency?: boolean;
  decimals?: boolean;
  minimumFractionDigits?: number;
}

interface IMoney {
  amount: number;
  currency: CurrencyEnum;
}

export class Money extends ValueObject<IMoney> {
  private _dinero: Dinero<number>;

  public constructor(props?: CreateMoney) {
    const amount = props?.amount ?? 0;

    const currency = props?.currency ?? CurrencyEnum.ARS;

    super({ amount, currency });

    this._dinero = dinero({
      amount: this.value.amount,
      currency: Money.getDineroCurrency(this.value.currency),
    });
  }

  public get amount(): number {
    return this.value.amount;
  }

  public get currency(): CurrencyEnum {
    return this.value.currency;
  }

  public static fromNumber(
    amount: number,
    currency: CurrencyEnum = CurrencyEnum.ARS,
  ): Money {
    return new Money({ amount: amount * 100, currency });
  }

  public add(amount: Money): Money {
    const result = add(this._dinero, amount.toDinero());

    return new Money({
      amount: toSnapshot(result).amount,
      currency: this.currency,
    });
  }

  public equals(vo?: Money): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    return this.isEqual(vo);
  }

  public format({
    currency = false,
    decimals = false,
    minimumFractionDigits = 2,
  }: FormatOptions = {}): string {
    const options: Intl.NumberFormatOptions = {
      currency: this.currency,
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

  public isEqual(value: Money) {
    return equal(this._dinero, value.toDinero());
  }

  public isGreaterThan(value: Money) {
    return greaterThan(this._dinero, value.toDinero());
  }

  public isGreaterThanOrEqual(value: Money) {
    return greaterThanOrEqual(this._dinero, value.toDinero());
  }

  public isGreaterThanZero() {
    return greaterThan(this._dinero, new Money().toDinero());
  }

  public isLessThan(value: Money) {
    return lessThan(this._dinero, value.toDinero());
  }

  public isLessThanOrEqual(value: Money) {
    return lessThanOrEqual(this._dinero, value.toDinero());
  }

  public isLessThanOrEqualZero() {
    return lessThanOrEqual(this._dinero, new Money().toDinero());
  }

  public isLessThanZero() {
    return lessThan(this._dinero, new Money().toDinero());
  }

  public isNegative() {
    return isNegative(this._dinero);
  }

  public isZero() {
    return isZero(this._dinero);
  }

  public subtract(value: Money): Money {
    const result = subtract(this._dinero, value.toDinero());

    return new Money({
      amount: toSnapshot(result).amount,
      currency: this.currency,
    });
  }

  public toInteger(): number {
    return Math.round(this.toNumber());
  }

  public toNumber(): number {
    return +toDecimal(this._dinero);
  }

  private static getDineroCurrency(currency: CurrencyEnum): Currency<number> {
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
    switch (this.currency) {
      case CurrencyEnum.ARS:
        return 'es-AR';

      case CurrencyEnum.USD:
        return 'en-US';

      default:
        throw new Error('Currency not supported');
    }
  }

  private toDinero(): Dinero<number> {
    return this._dinero;
  }
}
