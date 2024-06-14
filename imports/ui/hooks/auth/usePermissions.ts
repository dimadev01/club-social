import { useDuesPermissions } from '@ui/hooks/auth/useDuesPermissions';
import { useIsAdmin } from '@ui/hooks/auth/useIsAdmin';
import { useIsMember } from '@ui/hooks/auth/useIsMember';
import { useIsStaff } from '@ui/hooks/auth/useIsStaff';
import { useMemberPermissions } from '@ui/hooks/auth/useMemberPermissions';
import { useMovementsPermissions } from '@ui/hooks/auth/useMovementPermissions';
import { usePaymentsPermissions } from '@ui/hooks/auth/usePaymentsPermissions';

export const usePermissions = () => {
  const member = useMemberPermissions();

  const payments = usePaymentsPermissions();

  const dues = useDuesPermissions();

  const movements = useMovementsPermissions();

  const isAdmin = useIsAdmin();

  const isStaff = useIsStaff();

  const isMember = useIsMember();

  return {
    dues,
    isAdmin,
    isMember,
    isStaff,
    member,
    movements,
    payments,
  };
};
