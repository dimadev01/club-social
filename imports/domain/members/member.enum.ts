/* eslint-disable typescript-sort-keys/string-enum */
export enum MemberStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export const MemberStatusLabel = {
  [MemberStatusEnum.ACTIVE]: 'Activo',
  [MemberStatusEnum.INACTIVE]: 'Inactivo',
};

export const MemberStatusPluralLabel = {
  [MemberStatusEnum.ACTIVE]: 'Activos',
  [MemberStatusEnum.INACTIVE]: 'Inactivos',
};

export const getMemberStatusSelectOptions = () =>
  Object.values(MemberStatusEnum).map((status) => ({
    label: MemberStatusLabel[status],
    value: status,
  }));

export const getMemberStatusColumnFilters = () =>
  Object.values(MemberStatusEnum).map((status) => ({
    text: MemberStatusLabel[status],
    value: status,
  }));

export enum MemberCategoryEnum {
  MEMBER = 'member',
  ADHERENT_MEMBER = 'adherent-member',
  CADET = 'cadet',
  PRE_CADET = 'pre-cadet',
}

export const MemberCategorySortOrder: {
  [x in MemberCategoryEnum]: number;
} = {
  [MemberCategoryEnum.MEMBER]: 1,
  [MemberCategoryEnum.ADHERENT_MEMBER]: 2,
  [MemberCategoryEnum.CADET]: 3,
  [MemberCategoryEnum.PRE_CADET]: 4,
};

export const MemberCategoryLabel: {
  [x in MemberCategoryEnum]: string;
} = {
  [MemberCategoryEnum.MEMBER]: 'Socio',
  [MemberCategoryEnum.ADHERENT_MEMBER]: 'Socio Adherente',
  [MemberCategoryEnum.CADET]: 'Cadete',
  [MemberCategoryEnum.PRE_CADET]: 'Pre-Cadete',
};

export const MemberCategoryPluralLabel: {
  [x in MemberCategoryEnum]: string;
} = {
  [MemberCategoryEnum.MEMBER]: 'Socios',
  [MemberCategoryEnum.ADHERENT_MEMBER]: 'Socios Adherentes',
  [MemberCategoryEnum.CADET]: 'Cadetes',
  [MemberCategoryEnum.PRE_CADET]: 'Pre-Cadetes',
};

export const getMemberCategorySelectOptions = () =>
  Object.values(MemberCategoryEnum).map((category) => ({
    label: MemberCategoryLabel[category],
    value: category,
  }));

export const getMemberCategoryColumnFilters = () =>
  Object.values(MemberCategoryEnum).map((category) => ({
    text: MemberCategoryLabel[category],
    value: category,
  }));

export enum MemberMaritalStatusEnum {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
}

export const MemberMaritalStatusLabel: {
  [x in MemberMaritalStatusEnum]: string;
} = {
  [MemberMaritalStatusEnum.DIVORCED]: 'Divorciado',
  [MemberMaritalStatusEnum.MARRIED]: 'Casado',
  [MemberMaritalStatusEnum.SINGLE]: 'Soltero',
  [MemberMaritalStatusEnum.WIDOWED]: 'Viudo',
};

export const getMemberMaritalStatusSelectOptions = () =>
  Object.values(MemberMaritalStatusEnum).map((status) => ({
    label: MemberMaritalStatusLabel[status],
    value: status,
  }));

export enum MemberNationalityEnum {
  ARGENTINA = 'argentina',
  COLOMBIA = 'colombia',
  BULGARIA = 'bulgaria',
  UKRAINE = 'ukraine',
}

export const MemberNationalityLabel: {
  [x in MemberNationalityEnum]: string;
} = {
  [MemberNationalityEnum.ARGENTINA]: 'Argentina',
  [MemberNationalityEnum.COLOMBIA]: 'Colombia',
  [MemberNationalityEnum.UKRAINE]: 'Ucrania',
  [MemberNationalityEnum.BULGARIA]: 'Bulgaria',
};

export const getMemberNationalitySelectOptions = () =>
  Object.values(MemberNationalityEnum).map((value) => ({
    label: MemberNationalityLabel[value],
    value,
  }));

export enum MemberSexEnum {
  MALE = 'male',
  FEMALE = 'female',
}

export const MemberSexLabel: {
  [x in MemberSexEnum]: string;
} = {
  [MemberSexEnum.FEMALE]: 'Femenino',
  [MemberSexEnum.MALE]: 'Masculino',
};

export const getMemberSexSelectOptions = () =>
  Object.values(MemberSexEnum).map((value) => ({
    label: MemberSexLabel[value],
    value,
  }));

export enum MemberFileStatusEnum {
  COMPLETED = 'completed',
  PENDING = 'pending',
}

export const MemberFileStatusLabel: {
  [x in MemberFileStatusEnum]: string;
} = {
  [MemberFileStatusEnum.COMPLETED]: 'Completo',
  [MemberFileStatusEnum.PENDING]: 'Pendiente',
};

export const getMemberFileStatusSelectOptions = () =>
  Object.values(MemberFileStatusEnum).map((value) => ({
    label: MemberFileStatusLabel[value],
    value,
  }));

export const getMemberFileStatusColumnFilters = () =>
  Object.values(MemberFileStatusEnum).map((value) => ({
    text: MemberFileStatusLabel[value],
    value,
  }));

export enum MemberCreditTypeEnum {
  CREDIT = 'credit',
  DEBIT = 'debit',
}
