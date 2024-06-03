import 'numeral/locales';

import { toDecimal } from 'dinero.js';
import numeral from 'numeral';

import { MoneyUtils } from './money.utils';

numeral.locale('es');

export abstract class NumberUtils {
  public static format(amount: number): string {
    return new Intl.NumberFormat('es-AR').format(Number(amount));
  }

  public static formatCents(amount: number): string {
    const amountAsDinero = MoneyUtils.createDinero(amount);

    const amountAsString = toDecimal(amountAsDinero);

    return this.format(+amountAsString);
  }

  public static parseFromInputNumber(value: string, decimals = false): number {
    const result = numeral(value).value() ?? 0;

    if (decimals) {
      return result;
    }

    return Math.round(result);
  }
}
