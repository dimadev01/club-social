import { useMutation } from '@tanstack/react-query';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { UpdateUserThemeRequestDto } from '@application/users/dtos/update-user-theme-request.dto';

export const useUpdateUserTheme = () =>
  useMutation<null, Error, UpdateUserThemeRequestDto>(
    [MeteorMethodEnum.UsersUpdateTheme],
    (request) => Meteor.callAsync(MeteorMethodEnum.UsersUpdateTheme, request),
  );
