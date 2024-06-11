import 'numeral/locales';

import numeral from 'numeral';

numeral.locale('es');

export abstract class NumberUtils {
  public static parseFromInputNumber(value: string, decimals = false): number {
    const result = numeral(value).value() ?? 0;

    if (decimals) {
      return result;
    }

    return result;
  }
}
