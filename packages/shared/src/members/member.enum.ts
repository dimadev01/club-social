export const MemberCategory = {
  ADHERENT_MEMBER: 'adherent-member',
  CADET: 'cadet',
  MEMBER: 'member',
  PRE_CADET: 'pre-cadet',
} as const;

export type MemberCategory =
  (typeof MemberCategory)[keyof typeof MemberCategory];

export const MemberCategoryLabel = {
  [MemberCategory.ADHERENT_MEMBER]: 'Adherente',
  [MemberCategory.CADET]: 'Cadete',
  [MemberCategory.MEMBER]: 'Socio',
  [MemberCategory.PRE_CADET]: 'Pre-cadete',
} as const;

export const FileStatus = {
  COMPLETED: 'completed',
  PENDING: 'pending',
} as const;

export type FileStatus = (typeof FileStatus)[keyof typeof FileStatus];

export const FileStatusLabel = {
  [FileStatus.COMPLETED]: 'Completado',
  [FileStatus.PENDING]: 'Pendiente',
} as const;

export const MemberNationality = {
  ARGENTINA: 'argentina',
  BULGARIA: 'bulgaria',
  COLOMBIA: 'colombia',
  UKRAINE: 'ukraine',
} as const;

export type MemberNationality =
  (typeof MemberNationality)[keyof typeof MemberNationality];

export const MemberNationalityLabel = {
  [MemberNationality.ARGENTINA]: 'Argentina',
  [MemberNationality.BULGARIA]: 'Bulgaria',
  [MemberNationality.COLOMBIA]: 'Colombia',
  [MemberNationality.UKRAINE]: 'Ucrania',
} as const;

export const MemberSex = {
  FEMALE: 'female',
  MALE: 'male',
} as const;

export type MemberSex = (typeof MemberSex)[keyof typeof MemberSex];

export const MemberSexLabel = {
  [MemberSex.FEMALE]: 'Femenino',
  [MemberSex.MALE]: 'Masculino',
} as const;

export const MaritalStatus = {
  DIVORCED: 'divorced',
  MARRIED: 'married',
  SINGLE: 'single',
  WIDOWED: 'widowed',
} as const;

export type MaritalStatus = (typeof MaritalStatus)[keyof typeof MaritalStatus];

export const MaritalStatusLabel = {
  [MaritalStatus.DIVORCED]: 'Divorciado',
  [MaritalStatus.MARRIED]: 'Casado',
  [MaritalStatus.SINGLE]: 'Soltero',
  [MaritalStatus.WIDOWED]: 'Viudo',
} as const;
