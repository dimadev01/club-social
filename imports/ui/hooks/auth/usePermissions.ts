import { useDuesPermissions } from '@ui/hooks/auth/useDuesPermissions';
import { useEventsPermissions } from '@ui/hooks/auth/useEventsPermissions';
import { useIsAdmin } from '@ui/hooks/auth/useIsAdmin';
import { useIsMember } from '@ui/hooks/auth/useIsMember';
import { useIsStaff } from '@ui/hooks/auth/useIsStaff';
import { useMembersPermissions } from '@ui/hooks/auth/useMembersPermissions';
import { useMovementsPermissions } from '@ui/hooks/auth/useMovementPermissions';
import { usePaymentsPermissions } from '@ui/hooks/auth/usePaymentsPermissions';
import { useUsersPermissions } from '@ui/hooks/auth/useUsersPermissions';

export const usePermissions = () => {
  const member = useMembersPermissions();

  const payments = usePaymentsPermissions();

  const dues = useDuesPermissions();

  const movements = useMovementsPermissions();

  const events = useEventsPermissions();

  const users = useUsersPermissions();

  const isAdmin = useIsAdmin();

  const isStaff = useIsStaff();

  const isMember = useIsMember();

  return {
    dues,
    events,
    isAdmin,
    isMember,
    isStaff,
    member,
    movements,
    payments,
    users,
  };
};
