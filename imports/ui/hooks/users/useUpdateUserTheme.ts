import { useMutation } from '@tanstack/react-query';

import { UpdateUserThemeRequestDto } from '@domain/users/use-cases/update-user-theme/update-user-theme-request.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useUpdateUserTheme = () =>
  useMutation<null, Error, UpdateUserThemeRequestDto>(
    [MethodsEnum.UsersUpdateTheme],
    (request) => Meteor.callAsync(MethodsEnum.UsersUpdateTheme, request),
  );
