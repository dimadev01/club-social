import { tw } from '@/shared/lib/utils';

export const COMPONENT_WIDTHS = {
  DATE_PICKER: tw`w-full sm:w-auto`,
  INPUT: tw`w-full sm:w-auto`,
  INPUT_AMOUNT: tw`w-full sm:w-32`,
  MEMBER_SELECT: tw`w-full sm:w-80`,
  SELECT: tw`w-full sm:w-40`,
  TEXT_AREA: tw`w-full sm:w-80`,
} as const;
