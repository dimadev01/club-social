import invariant from 'tiny-invariant';

import { useUserContext } from '@ui/providers/UserContext';

export const useLoggedInUser = () => {
  const { user } = useUserContext();

  invariant(user);

  return user;
};
