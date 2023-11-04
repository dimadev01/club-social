/* eslint-disable typescript-sort-keys/string-enum */
export enum MemberStatusEnum {
  Active = 'active',
  Inactive = 'inactive',
}

export const MemberStatusLabel = {
  [MemberStatusEnum.Active]: 'Activo',
  [MemberStatusEnum.Inactive]: 'Inactivo',
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
  Member = 'member',
  Cadet = 'cadet',
}

export const MemberCategoryLabel = {
  [MemberCategoryEnum.Cadet]: 'Cadete',
  [MemberCategoryEnum.Member]: 'Socio',
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
  Single = 'single',
  Married = 'married',
  Divorced = 'divorced',
  Widowed = 'widowed',
}

export const MemberMaritalStatusLabel = {
  [MemberMaritalStatusEnum.Divorced]: 'Divorciado',
  [MemberMaritalStatusEnum.Married]: 'Casado',
  [MemberMaritalStatusEnum.Single]: 'Soltero',
  [MemberMaritalStatusEnum.Widowed]: 'Viudo',
};

export const getMemberMaritalStatusOptions = () =>
  Object.values(MemberMaritalStatusEnum).map((status) => ({
    label: MemberMaritalStatusLabel[status],
    value: status,
  }));

export enum MemberNationalityEnum {
  Argentina = 'argentina',
  Colombia = 'colombia',
  Bulgaria = 'bulgaria',
  Ukraine = 'ukraine',
}

export const MemberNationalityLabel = {
  [MemberNationalityEnum.Argentina]: 'Argentina',
  [MemberNationalityEnum.Colombia]: 'Colombia',
  [MemberNationalityEnum.Ukraine]: 'Ucrania',
  [MemberNationalityEnum.Bulgaria]: 'Bulgaria',
};

export const getMemberNationalityOptions = () =>
  Object.values(MemberNationalityEnum).map((value) => ({
    label: MemberNationalityLabel[value],
    value,
  }));

export enum MemberSexEnum {
  Male = 'male',
  Female = 'female',
}

export const MemberSexLabel = {
  [MemberSexEnum.Female]: 'Femenino',
  [MemberSexEnum.Male]: 'Masculino',
};

export const getMemberSexOptions = () =>
  Object.values(MemberSexEnum).map((value) => ({
    label: MemberSexLabel[value],
    value,
  }));

export enum MemberFileStatusEnum {
  Completed = 'completed',
  Pending = 'pending',
}

export const MemberFileStatusLabel = {
  [MemberFileStatusEnum.Completed]: 'Completo',
  [MemberFileStatusEnum.Pending]: 'Pendiente',
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
