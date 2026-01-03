import { DueCategory } from '@club-social/shared/dues';

import { ElectricityIcon, GuestIcon, MembershipIcon } from '@/ui';

export const DueCategoryIconMap: Record<DueCategory, React.ReactNode> = {
  [DueCategory.ELECTRICITY]: <ElectricityIcon />,
  [DueCategory.GUEST]: <GuestIcon />,
  [DueCategory.MEMBERSHIP]: <MembershipIcon />,
};
