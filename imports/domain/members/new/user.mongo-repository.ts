import { inject, injectable } from 'tsyringe';

import { UserCollection2 } from '../../../infra/mongo/collections/user.collection';

import { UserModel } from './user.business';
import { UserMapper } from './user.mapper';

@injectable()
export class UserMongoRepository {
  public constructor(
    @inject(UserCollection2)
    private readonly collection: UserCollection2,
    @inject(UserMapper)
    private readonly _userMapper: UserMapper,
  ) {}

  public async findOneById(id: string): Promise<UserModel | null> {
    const user = await this.collection.collection.findOneAsync(id);

    if (!user) {
      return null;
    }

    const userOrm = this._userMapper.mapToOrmMeteorUser(user);

    return this._userMapper.mapToDomain(userOrm);
  }
}
