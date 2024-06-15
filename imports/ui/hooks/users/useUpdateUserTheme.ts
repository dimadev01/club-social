import { useMutation } from '@tanstack/react-query';

import { UpdateUserThemeRequestDto } from '@application/users/dtos/update-user-theme-request.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';

export const useUpdateUserTheme = () =>
  useMutation<null, Error, UpdateUserThemeRequestDto>(
    [MeteorMethodEnum.UsersUpdateTheme],
    (request) => Meteor.callAsync(MeteorMethodEnum.UsersUpdateTheme, request),
  );
