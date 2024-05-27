import { Result, ok } from 'neverthrow';

import { Model } from '@domain/common/models/model';
import {
  CreateUser,
  IUserModel,
} from '@domain/users/models/user-model.interface';

export class UserModel extends Model implements IUserModel {
  public firstName: string;

  public constructor(props?: IUserModel) {
    super(props);

    this.firstName = props?.firstName ?? '';
  }

  public static createOne(props: CreateUser): Result<UserModel, Error> {
    const user = new UserModel();

    user.firstName = props.firstName;

    return ok(user);
  }
}
