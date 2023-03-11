import qs from 'qs';
import { URLSearchParamsInit } from 'react-router-dom';

export abstract class UrlUtils {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static stringify(obj: any): URLSearchParamsInit {
    return qs.stringify(obj, {
      arrayFormat: 'brackets',
      encode: false,
      skipNulls: true,
    });
  }
}
