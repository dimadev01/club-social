import { inject, injectable } from 'tsyringe';

import { ILogger } from '@application/logger/logger.interface';
import { UserModel } from '@domain/users/models/user.model';
import { DIToken } from '@infra/di/di-tokens';
import { UserMapper } from '@infra/mappers/user.mapper';
import { MongoCollection } from '@infra/mongo/collections/mongo.collection';
import { UserCollection2 } from '@infra/mongo/collections/user.collection';
import { UserEntity } from '@infra/mongo/entities/users/user.entity';
import { CrudMongoRepository } from '@infra/mongo/repositories/common/crud-mongo.repository';
import { IUserRepository } from '@infra/mongo/repositories/users/user-repository.interface';

@injectable()
export class UserMongoRepository
  extends CrudMongoRepository<UserModel, UserEntity>
  implements IUserRepository
{
  public constructor(
    @inject(UserCollection2)
    protected readonly meteorUsers: UserCollection2,
    @inject(UserMapper)
    protected readonly mapper: UserMapper,
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
  ) {
    super(
      meteorUsers.collection as unknown as MongoCollection<UserEntity>,
      mapper,
      logger,
    );
  }
}
