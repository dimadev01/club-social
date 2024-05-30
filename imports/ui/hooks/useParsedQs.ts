import qs from 'qs';
import { useLocation } from 'react-router-dom';

export function useParsedQs() {
  const location = useLocation();

  return qs.parse(location.search, { ignoreQueryPrefix: true });
}
