import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { FindOneById } from '@application/common/repositories/queryable.repository';
import { IUseCase } from '@application/common/use-case.interface';
import { UserDto } from '@application/users/dtos/user.dto';
import { UserDtoMapper } from '@application/users/mappers/user-dto.mapper';
import { IUserRepository } from '@application/users/repositories/user.repository';
import { ModelNotFoundError } from '@domain/common/errors/model-not-found.error';

@injectable()
export class GetUserUseCase implements IUseCase<FindOneById, UserDto> {
  public constructor(
    @inject(DIToken.IUserRepository)
    private readonly _userRepository: IUserRepository,
    private readonly _userDtoMapper: UserDtoMapper,
  ) {}

  public async execute(request: FindOneById): Promise<Result<UserDto, Error>> {
    const user = await this._userRepository.findOneById(request);

    if (!user) {
      return err(new ModelNotFoundError());
    }

    return ok(this._userDtoMapper.toDto(user));
  }
}
