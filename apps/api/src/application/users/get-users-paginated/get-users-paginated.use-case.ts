import { UseCase } from '@/application/shared/use-case';
import { ok, Result } from '@/domain/shared/result';
import {
  PaginatedRequestParams,
  PaginatedResponse,
} from '@/domain/shared/types';
import { UserEntity } from '@/domain/users/user.entity';
import { UserRepository } from '@/domain/users/user.repository';

export class GetUsersPaginatedUseCase extends UseCase<
  PaginatedResponse<UserEntity>
> {
  public constructor(private readonly userRepository: UserRepository) {
    super();
  }

  public async execute(
    params: PaginatedRequestParams,
  ): Promise<Result<PaginatedResponse<UserEntity>>> {
    const users = await this.userRepository.findPaginated(params);

    return ok(users);
  }
}
