import qs from 'qs';
import { URLSearchParamsInit } from 'react-router-dom';

export abstract class UrlUtils {
  public static navigate(
    url: string,
    obj?: unknown,
    options?: qs.IStringifyOptions
  ): string {
    if (!obj) {
      return url;
    }

    return `${url}${this.stringify(obj, options)}`;
  }

  public static parse(): qs.ParsedQs {
    return qs.parse(window.location.search, { ignoreQueryPrefix: true });
  }

  public static stringify(
    obj: unknown,
    options?: qs.IStringifyOptions
  ): URLSearchParamsInit {
    return qs.stringify(obj, {
      addQueryPrefix: true,
      arrayFormat: 'brackets',
      encode: false,
      skipNulls: true,
      ...options,
    });
  }
}
