import { useMutation } from '@tanstack/react-query';

import { UpdateUserThemeRequestDto } from '@domain/users/use-cases/update-user-theme/update-user-theme-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

export const useUpdateUserTheme = () =>
  useMutation<null, Error, UpdateUserThemeRequestDto>(
    [MeteorMethodEnum.UsersUpdateTheme],
    (request) => Meteor.callAsync(MeteorMethodEnum.UsersUpdateTheme, request),
  );
