import { inject, injectable } from 'tsyringe';

import { ILogger } from '@application/logger/logger.interface';
import { UserModel } from '@domain/users/models/user.model';
import { IUserRepository } from '@domain/users/user-repository.interface';
import { DIToken } from '@infra/di/di-tokens';
import { UserMapper } from '@infra/mappers/user.mapper';
import { MongoCollection } from '@infra/mongo/collections/mongo.collection';
import { UserCollection } from '@infra/mongo/collections/user.collection';
import { UserEntity } from '@infra/mongo/entities/users/user.entity';
import { CrudMongoRepository } from '@infra/mongo/repositories/common/crud-mongo.repository';

@injectable()
export class UserMongoRepository
  extends CrudMongoRepository<UserModel, UserEntity>
  implements IUserRepository
{
  public constructor(
    @inject(UserCollection)
    protected readonly meteorUsers: UserCollection,
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
