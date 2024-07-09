import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import {
  FindPaginatedRequest,
  FindPaginatedResponse,
} from '@application/common/repositories/grid.repository';
import { IUseCase } from '@application/common/use-case.interface';
import { UserGridDto } from '@application/users/dtos/user-grid.dto';
import { IUserRepository } from '@application/users/repositories/user.repository';

@injectable()
export class GetUsersGridUseCase
  implements IUseCase<FindPaginatedRequest, FindPaginatedResponse<UserGridDto>>
{
  public constructor(
    @inject(DIToken.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}

  public async execute(
    request: FindPaginatedRequest,
  ): Promise<Result<FindPaginatedResponse<UserGridDto>, Error>> {
    const { items, totalCount } =
      await this._userRepository.findPaginated(request);

    const dtos = items.map<UserGridDto>((user) => ({
      createdAt: user.createdAt.toISOString(),
      email: user.emails[0]?.address ?? '',
      firstName: user.firstName,
      id: user._id,
      lastName: user.lastName,
      name: user.nameLastFirst,
      role: user.role,
    }));

    return ok({ items: dtos, totalCount });
  }
}
