export const MemberStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export type MemberStatus = (typeof MemberStatus)[keyof typeof MemberStatus];

export const MemberStatusLabel = {
  [MemberStatus.ACTIVE]: 'Activo',
  [MemberStatus.INACTIVE]: 'Inactivo',
} as const;

export const MemberStatusSort = {
  [MemberStatus.ACTIVE]: 1,
  [MemberStatus.INACTIVE]: 2,
} as const;

export const MemberStatusSorted = Object.values(MemberStatus).sort(
  (a, b) => MemberStatusSort[a] - MemberStatusSort[b],
);

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

export const MemberCategorySort = {
  [MemberCategory.ADHERENT_MEMBER]: 4,
  [MemberCategory.CADET]: 2,
  [MemberCategory.MEMBER]: 1,
  [MemberCategory.PRE_CADET]: 3,
} as const;

export const MemberCategoryOptions = Object.entries(MemberCategoryLabel)
  .map(([key, value]) => ({ label: value, value: key }))
  .sort(
    (a, b) =>
      MemberCategorySort[a.value as MemberCategory] -
      MemberCategorySort[b.value as MemberCategory],
  );

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
