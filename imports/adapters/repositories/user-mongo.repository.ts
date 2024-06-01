import { Mongo } from 'meteor/mongo';
import { inject, injectable } from 'tsyringe';

import { UserMapper } from '@adapters/mappers/user.mapper';
import { UserEntity } from '@adapters/mongo/entities/user.entity';
import { CrudMongoRepository } from '@adapters/repositories/crud-mongo.repository';
import { ILogger } from '@domain/common/logger/logger.interface';
import { DIToken } from '@domain/common/tokens.di';
import { UserModel } from '@domain/users/models/user.model';
import { IUserRepository } from '@domain/users/repositories/user.repository';

@injectable()
export class UserMongoRepository
  extends CrudMongoRepository<UserModel, UserEntity>
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

  public async findByEmail(email: string): Promise<UserModel | null> {
    const user = Accounts.findUserByEmail(email);

    if (!user) {
      return null;
    }

    return this.mapper.toModel(user as UserEntity);
  }
}
