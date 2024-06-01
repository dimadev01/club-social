import { IUserRepository } from '@domain/users/user-repository.interface';
import { Mongo } from 'meteor/mongo';
import { inject, injectable } from 'tsyringe';

import { ILogger } from '@application/logger/logger.interface';
import { DIToken } from '@domain/common/tokens.di';
import { UserModel } from '@domain/users/models/user.model';
import { UserMapper } from '@infra/mappers/user.mapper';
import { UserEntity } from '@infra/mongo/entities/user.entity';
import { CrudMongoRepository } from '@infra/mongo/repositories/crud-mongo.repository';

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
