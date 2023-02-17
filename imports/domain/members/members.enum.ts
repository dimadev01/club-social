export enum MemberStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export enum MemberCategory {
  Cadet = 'cadet',
  Member = 'member',
}

export const MemberCategoryLabels = {
  [MemberCategory.Cadet]: 'Cadete',
  [MemberCategory.Member]: 'Socio',
};

export const MemberCategoryOptions = () =>
  Object.values(MemberCategory).map((category) => ({
    label: MemberCategoryLabels[category],
    value: category,
  }));

export enum MemberMaritalStatus {
  Divorced = 'divorced',
  Married = 'married',
  Single = 'single',
  Widowed = 'widowed',
}

export enum MemberNationality {
  Argentina = 'argentina',
  Colombia = 'colombia',
  Ukraine = 'ukraine',
}

export enum MemberSex {
  Female = 'female',
  Male = 'male',
}
