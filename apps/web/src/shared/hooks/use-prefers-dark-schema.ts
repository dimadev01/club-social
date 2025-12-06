import { useMediaQuery } from 'usehooks-ts';

export function usePrefersDarkSchema() {
  return useMediaQuery('(prefers-color-scheme: dark)');
}
