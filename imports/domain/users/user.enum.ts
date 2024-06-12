export enum UserStateEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum UserThemeEnum {
  AUTO = 'auto',
  DARK = 'dark',
  LIGHT = 'light',
}

export const UserThemeLabel: {
  [x in UserThemeEnum]: string;
} = {
  [UserThemeEnum.AUTO]: 'Automático',
  [UserThemeEnum.DARK]: 'Oscuro',
  [UserThemeEnum.LIGHT]: 'Claro',
};
