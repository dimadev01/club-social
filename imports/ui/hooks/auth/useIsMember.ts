import { RoleEnum } from '@domain/roles/role.enum';
import { useLoggedInUser } from '@ui/hooks/auth/useLoggedInUser';

export const useIsMember = () => {
  const user = useLoggedInUser();

  return user.profile?.role === RoleEnum.MEMBER;
};
