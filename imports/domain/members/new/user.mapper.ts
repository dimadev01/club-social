import { singleton } from 'tsyringe';

import { UserModel } from './user.business';
import { UserOrm } from './user.orm';

@singleton()
export class UserMapper {
  public mapToDomain(orm: UserOrm): UserModel {
    return new UserModel();
  }

  public mapToOrm(domain: UserModel): UserOrm {
    return new UserOrm();
  }

  public mapToOrmMeteorUser(user: Meteor.User) {
    return new UserOrm();
  }
}
