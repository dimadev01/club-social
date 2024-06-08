import { RoleEnum } from '@domain/roles/role.enum';
import { useLoggedInUser } from '@ui/hooks/auth/useLoggedInUser';

export const useIsAdmin = () => {
  const user = useLoggedInUser();

  return user.profile?.role === RoleEnum.ADMIN;
};
