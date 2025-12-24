import { useSession } from './useSession';

export function useSessionUser() {
  return useSession().user;
}
