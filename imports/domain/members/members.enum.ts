export enum MemberStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export const MemberStatusLabel = {
  [MemberStatus.Active]: 'Activo',
  [MemberStatus.Inactive]: 'Inactivo',
};

export const MemberStatusOptions = () =>
  Object.values(MemberStatus).map((status) => ({
    label: MemberStatusLabel[status],
    value: status,
  }));

export enum MemberCategory {
  Cadet = 'cadet',
  Member = 'member',
}

export const MemberCategoryLabel = {
  [MemberCategory.Cadet]: 'Cadete',
  [MemberCategory.Member]: 'Socio',
};

export const MemberCategoryOptions = () =>
  Object.values(MemberCategory).map((category) => ({
    label: MemberCategoryLabel[category],
    value: category,
  }));

export enum MemberMaritalStatus {
  Divorced = 'divorced',
  Married = 'married',
  Single = 'single',
  Widowed = 'widowed',
}

export const MemberMaritalStatusLabel = {
  [MemberMaritalStatus.Divorced]: 'Divorciado',
  [MemberMaritalStatus.Married]: 'Casado',
  [MemberMaritalStatus.Single]: 'Soltero',
  [MemberMaritalStatus.Widowed]: 'Viudo',
};

export const MemberMaritalStatusOptions = () =>
  Object.values(MemberMaritalStatus).map((status) => ({
    label: MemberMaritalStatusLabel[status],
    value: status,
  }));

export enum MemberNationality {
  Argentina = 'argentina',
  Colombia = 'colombia',
  Ukraine = 'ukraine',
}

export const MemberNationalityLabel = {
  [MemberNationality.Argentina]: 'Argentina',
  [MemberNationality.Colombia]: 'Colombia',
  [MemberNationality.Ukraine]: 'Ucrania',
};

export const MemberNationalityOptions = () =>
  Object.values(MemberNationality).map((value) => ({
    label: MemberNationalityLabel[value],
    value,
  }));

export enum MemberSex {
  Female = 'female',
  Male = 'male',
}

export const MemberSexLabel = {
  [MemberSex.Female]: 'Femenino',
  [MemberSex.Male]: 'Masculino',
};

export const MemberSexOptions = () =>
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

export const MemberFileStatusOptions = () =>
  Object.values(MemberFileStatus).map((value) => ({
    label: MemberFileStatusLabel[value],
    value,
  }));
