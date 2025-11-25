import type { Result } from '@/domain/shared/result';
import type { UserRepository } from '@/domain/users/user.repository';

import { UseCase } from '@/application/shared/use-case';
import { err, ok } from '@/domain/shared/result';
import { UserEntity } from '@/domain/users/user.entity';

import type { CreateUserParams } from './create-user.params';

export class CreateUserUseCase extends UseCase<UserEntity> {
  public constructor(private readonly userRepository: UserRepository) {
    super();
  }

  public async execute(params: CreateUserParams): Promise<Result<UserEntity>> {
    const user = UserEntity.create({
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
    });

    if (user.isErr()) {
      return err(user.error);
    }

    await this.userRepository.save(user.value);

    return ok(user.value);
  }
}
