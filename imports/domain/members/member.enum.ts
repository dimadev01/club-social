/* eslint-disable typescript-sort-keys/string-enum */
export enum MemberStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export const MemberStatusLabel = {
  [MemberStatusEnum.ACTIVE]: 'Activo',
  [MemberStatusEnum.INACTIVE]: 'Inactivo',
};

export const getMemberStatusOptions = () =>
  Object.values(MemberStatusEnum).map((status) => ({
    label: MemberStatusLabel[status],
    value: status,
  }));

export const getMemberStatusFilters = () =>
  Object.values(MemberStatusEnum).map((status) => ({
    text: MemberStatusLabel[status],
    value: status,
  }));

export enum MemberCategoryEnum {
  MEMBER = 'member',
  CADET = 'cadet',
}

export const MemberCategoryLabel = {
  [MemberCategoryEnum.CADET]: 'Cadete',
  [MemberCategoryEnum.MEMBER]: 'Socio',
};

export const getMemberCategoryOptions = () =>
  Object.values(MemberCategoryEnum).map((category) => ({
    label: MemberCategoryLabel[category],
    value: category,
  }));

export const getMemberCategoryFilters = () =>
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

export const MemberMaritalStatusLabel = {
  [MemberMaritalStatusEnum.DIVORCED]: 'Divorciado',
  [MemberMaritalStatusEnum.MARRIED]: 'Casado',
  [MemberMaritalStatusEnum.SINGLE]: 'Soltero',
  [MemberMaritalStatusEnum.WIDOWED]: 'Viudo',
};

export const getMemberMaritalStatusOptions = () =>
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

export const MemberNationalityLabel = {
  [MemberNationalityEnum.ARGENTINA]: 'Argentina',
  [MemberNationalityEnum.COLOMBIA]: 'Colombia',
  [MemberNationalityEnum.UKRAINE]: 'Ucrania',
  [MemberNationalityEnum.BULGARIA]: 'Bulgaria',
};

export const getMemberNationalityOptions = () =>
  Object.values(MemberNationalityEnum).map((value) => ({
    label: MemberNationalityLabel[value],
    value,
  }));

export enum MemberSexEnum {
  MALE = 'male',
  FEMALE = 'female',
}

export const MemberSexLabel = {
  [MemberSexEnum.FEMALE]: 'Femenino',
  [MemberSexEnum.MALE]: 'Masculino',
};

export const getMemberSexOptions = () =>
  Object.values(MemberSexEnum).map((value) => ({
    label: MemberSexLabel[value],
    value,
  }));

export enum MemberFileStatusEnum {
  COMPLETED = 'completed',
  PENDING = 'pending',
}

export const MemberFileStatusLabel = {
  [MemberFileStatusEnum.COMPLETED]: 'Completo',
  [MemberFileStatusEnum.PENDING]: 'Pendiente',
};

export const getMemberFileStatusOptions = () =>
  Object.values(MemberFileStatusEnum).map((value) => ({
    label: MemberFileStatusLabel[value],
    value,
  }));

export const getMemberFileStatusFilters = () =>
  Object.values(MemberFileStatusEnum).map((value) => ({
    text: MemberFileStatusLabel[value],
    value,
  }));
