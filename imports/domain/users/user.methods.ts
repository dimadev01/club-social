import { container } from 'tsyringe';

import { GetUserByTokenRequestDto } from '@application/users/dtos/get-user-by-token-request.dto';
import { UpdateUserThemeRequestDto } from '@application/users/dtos/update-user-theme-request.dto';
import { GetUserByTokenUseCase } from '@application/users/use-cases/get-user-by-token/get-user-by-token.use-case';
import { UpdateUserThemeUseCase } from '@application/users/use-cases/update-user-theme/update-user-theme.use-case';
import { OldMeteorMethod } from '@infra/meteor/common/meteor-methods.base';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';

export class UserMethodOld extends OldMeteorMethod {
  public register() {
    Meteor.methods({
      [MeteorMethodEnum.UsersGetByToken]: (request: GetUserByTokenRequestDto) =>
        this.execute(container.resolve(GetUserByTokenUseCase), request),

      [MeteorMethodEnum.UsersUpdateTheme]: (
        request: UpdateUserThemeRequestDto,
      ) =>
        this.execute(
          container.resolve(UpdateUserThemeUseCase),
          request,
          UpdateUserThemeRequestDto,
        ),
    });
  }
}
