import { container } from 'tsyringe';

import { CreateUserUseCase } from '@application/users/use-cases/create-user/create-user.use-case';
import { GetUserUseCase } from '@application/users/use-cases/get-user/get-user.use.case';
import { GetUsersGridUseCase } from '@application/users/use-cases/get-users-grid/get-users-grid.use-case';
import { UpdateUserUseCase } from '@application/users/use-cases/update-user/update-user.use-case';
import { MeteorMethods } from '@infra/meteor/common/meteor-methods';
import { GetGridRequestDto } from '@ui/common/dtos/get-grid-request.dto';
import { GetOneByIdRequestDto } from '@ui/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { CreateUserRequestDto } from '@ui/dtos/create-user-request.dto';
import { UpdateUserRequestDto } from '@ui/dtos/update-user-request.dto';

export class UserMethods extends MeteorMethods {
  public register(): void {
    Meteor.methods({
      [MeteorMethodEnum.UsersCreate]: async (req: CreateUserRequestDto) => {
        await this.execute(
          container.resolve(CreateUserUseCase),
          CreateUserRequestDto,
          req,
        );

        return null;
      },

      [MeteorMethodEnum.UsersUpdate]: async (req: UpdateUserRequestDto) => {
        await this.execute(
          container.resolve(UpdateUserUseCase),
          UpdateUserRequestDto,
          req,
        );

        return null;
      },

      [MeteorMethodEnum.UsersGetOne]: async (req: GetOneByIdRequestDto) =>
        this.execute(
          container.resolve(GetUserUseCase),
          GetOneByIdRequestDto,
          req,
        ),

      [MeteorMethodEnum.UsersGetGrid]: async (req: GetGridRequestDto) =>
        this.execute(
          container.resolve(GetUsersGridUseCase),
          GetGridRequestDto,
          req,
        ),
    });
  }
}
