import { UpdateUserThemeRequestDto } from '@application/users/use-cases/update-user-theme/update-user-theme-request.dto';
import { useMutation } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';

export const useUpdateUserTheme = () =>
  useMutation<null, Error, UpdateUserThemeRequestDto>(
    [MeteorMethodEnum.UsersUpdateTheme],
    (request) => Meteor.callAsync(MeteorMethodEnum.UsersUpdateTheme, request),
  );
