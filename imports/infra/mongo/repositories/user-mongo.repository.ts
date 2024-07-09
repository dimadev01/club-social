import { Mongo } from 'meteor/mongo';
import type { Document } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILoggerService } from '@application/common/logger/logger.interface';
import {
  FindPaginatedRequest,
  FindPaginatedResponse,
} from '@application/common/repositories/grid.repository';
import { IUserRepository } from '@application/users/repositories/user.repository';
import { RoleEnum } from '@domain/roles/role.enum';
import { User } from '@domain/users/models/user.model';
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
    @inject(DIToken.ILoggerService)
    protected readonly logger: ILoggerService,
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

  public findPaginated(
    request: FindPaginatedRequest,
  ): Promise<FindPaginatedResponse<User>> {
    const query: Mongo.Query<UserEntity> = {
      'profile.role': { $in: [RoleEnum.STAFF] },
    };

    const pipeline: Document[] = [
      { $match: query },
      ...this.getPaginatedPipeline(request),
    ];

    return super.paginate(pipeline, query);
  }
}
