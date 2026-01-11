import { tw } from '@/shared/lib/utils';

export const COMPONENT_WIDTHS = {
  INPUT_AMOUNT: tw`w-full sm:w-32`,
  MEMBER_SELECT: tw`w-full sm:w-80`,
  SELECT: tw`w-full sm:w-40`,
  TEXT_AREA: tw`w-full sm:w-80`,
} as const;
