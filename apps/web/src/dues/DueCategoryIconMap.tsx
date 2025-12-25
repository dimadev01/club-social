import { DueCategory } from '@club-social/shared/dues';

import { ElectricityIcon } from '@/ui/Icons/ElectricityIcon';
import { GuestIcon } from '@/ui/Icons/GuestIcon';
import { MembershipIcon } from '@/ui/Icons/MembershipIcon';

export const CategoryIconMap: Record<DueCategory, React.ReactNode> = {
  [DueCategory.ELECTRICITY]: <ElectricityIcon />,
  [DueCategory.GUEST]: <GuestIcon />,
  [DueCategory.MEMBERSHIP]: <MembershipIcon />,
};
