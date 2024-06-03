import { Mongo } from 'meteor/mongo';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILogger } from '@domain/common/logger/logger.interface';
import { User } from '@domain/users/models/user.model';
import { IUserRepository } from '@domain/users/repositories/user.repository';
import { UserEntity } from '@infra/mongo/entities/user.entity';
import { UserMapper } from '@infra/mongo/mappers/user.mapper';
import { CrudMongoRepository } from '@infra/mongo/repositories/common/crud-mongo.repository';

@injectable()
export class UserMongoRepository
  extends CrudMongoRepository<User, UserEntity>
  implements IUserRepository
{
  public constructor(
    @inject(DIToken.IMeteorUsers)
    protected readonly collection: Mongo.Collection<UserEntity>,
    @inject(UserMapper)
    protected readonly mapper: UserMapper,
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
  ) {
    super(collection, mapper, logger);
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = Accounts.findUserByEmail(email);

    if (!user) {
      return null;
    }

    return this.mapper.toDomain(user as UserEntity);
  }
}
