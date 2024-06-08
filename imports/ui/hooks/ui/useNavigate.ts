import qs from 'qs';
import { To, useNavigate as reactQueryUseNavigate } from 'react-router-dom';

interface Props {
  replace?: boolean;
  state?: Record<string, unknown>;
}

export interface NavigateFunc {
  (to: To, props?: Props): void;
  (delta: number): void;
}

export function useNavigate(): NavigateFunc {
  const navigate = reactQueryUseNavigate();

  return (to: To | number, props: Props = { replace: true }) => {
    const queryString = qs.stringify(props.state, {
      addQueryPrefix: true,
      arrayFormat: 'brackets',
      encode: false,
      skipNulls: true,
    });

    if (typeof to === 'number') {
      return navigate(to as To, { replace: props.replace });
    }

    if (typeof to === 'string') {
      return navigate(`${to}${queryString}`, { replace: props.replace });
    }

    return navigate(to, { replace: props.replace });
  };
}
