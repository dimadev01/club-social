import { Result, ok } from 'neverthrow';

import { Model } from '@domain/common/models/model';
import {
  CreateMember,
  IMemberModel,
} from '@domain/members/models/member-model.interface';
import { UserModel } from '@domain/users/models/user.model';

export class MemberModel extends Model implements IMemberModel {
  public user: UserModel | null = null;

  public userId: string;

  public constructor(props?: IMemberModel) {
    super(props);

    this.userId = props?.userId ?? '';
  }

  public static createOne(props: CreateMember): Result<MemberModel, Error> {
    const member = new MemberModel();

    member.userId = props.userId;

    return ok(member);
  }
}
