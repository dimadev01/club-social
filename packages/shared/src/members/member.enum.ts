export const MemberCategory = {
  ADHERENT_MEMBER: 'adherent-member',
  CADET: 'cadet',
  MEMBER: 'member',
  PRE_CADET: 'pre-cadet',
} as const;

export type MemberCategory =
  (typeof MemberCategory)[keyof typeof MemberCategory];

export const FileStatus = {
  COMPLETED: 'completed',
  PENDING: 'pending',
} as const;

export type FileStatus = (typeof FileStatus)[keyof typeof FileStatus];

export const MemberNationality = {
  ARGENTINA: 'argentina',
  BULGARIA: 'bulgaria',
  COLOMBIA: 'colombia',
  UKRAINE: 'ukraine',
} as const;

export type MemberNationality =
  (typeof MemberNationality)[keyof typeof MemberNationality];

export const MemberSex = {
  FEMALE: 'female',
  MALE: 'male',
} as const;

export type MemberSex = (typeof MemberSex)[keyof typeof MemberSex];
