import { useSession } from './useSession';

export function useUser() {
  return useSession().user;
}
