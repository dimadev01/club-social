/* eslint-disable typescript-sort-keys/string-enum */
export enum MemberStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export const MemberStatusLabel = {
  [MemberStatus.Active]: 'Activo',
  [MemberStatus.Inactive]: 'Inactivo',
};

export const getMemberStatusOptions = () =>
  Object.values(MemberStatus).map((status) => ({
    label: MemberStatusLabel[status],
    value: status,
  }));

export const getMemberStatusFilters = () =>
  Object.values(MemberStatus).map((status) => ({
    text: MemberStatusLabel[status],
    value: status,
  }));

export enum MemberCategory {
  Member = 'member',
  Cadet = 'cadet',
}

export const MemberCategoryLabel = {
  [MemberCategory.Cadet]: 'Cadete',
  [MemberCategory.Member]: 'Socio',
};

export const getMemberCategoryOptions = () =>
  Object.values(MemberCategory).map((category) => ({
    label: MemberCategoryLabel[category],
    value: category,
  }));

export const getMemberCategoryFilters = () =>
  Object.values(MemberCategory).map((category) => ({
    text: MemberCategoryLabel[category],
    value: category,
  }));

export enum MemberMaritalStatus {
  Single = 'single',
  Married = 'married',
  Divorced = 'divorced',
  Widowed = 'widowed',
}

export const MemberMaritalStatusLabel = {
  [MemberMaritalStatus.Divorced]: 'Divorciado',
  [MemberMaritalStatus.Married]: 'Casado',
  [MemberMaritalStatus.Single]: 'Soltero',
  [MemberMaritalStatus.Widowed]: 'Viudo',
};

export const getMemberMaritalStatusOptions = () =>
  Object.values(MemberMaritalStatus).map((status) => ({
    label: MemberMaritalStatusLabel[status],
    value: status,
  }));

export enum MemberNationality {
  Argentina = 'argentina',
  Colombia = 'colombia',
  Bulgaria = 'bulgaria',
  Ukraine = 'ukraine',
}

export const MemberNationalityLabel = {
  [MemberNationality.Argentina]: 'Argentina',
  [MemberNationality.Colombia]: 'Colombia',
  [MemberNationality.Ukraine]: 'Ucrania',
};

export const getMemberNationalityOptions = () =>
  Object.values(MemberNationality).map((value) => ({
    label: MemberNationalityLabel[value],
    value,
  }));

export enum MemberSex {
  Male = 'male',
  Female = 'female',
}

export const MemberSexLabel = {
  [MemberSex.Female]: 'Femenino',
  [MemberSex.Male]: 'Masculino',
};

export const getMemberSexOptions = () =>
  Object.values(MemberSex).map((value) => ({
    label: MemberSexLabel[value],
    value,
  }));

export enum MemberFileStatus {
  Completed = 'completed',
  Pending = 'pending',
}

export const MemberFileStatusLabel = {
  [MemberFileStatus.Completed]: 'Completo',
  [MemberFileStatus.Pending]: 'Pendiente',
};

export const getMemberFileStatusOptions = () =>
  Object.values(MemberFileStatus).map((value) => ({
    label: MemberFileStatusLabel[value],
    value,
  }));

export const getMemberFileStatusFilters = () =>
  Object.values(MemberFileStatus).map((value) => ({
    text: MemberFileStatusLabel[value],
    value,
  }));
