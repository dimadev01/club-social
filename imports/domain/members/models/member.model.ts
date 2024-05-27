import { Result, err, ok } from 'neverthrow';

import { Model } from '@domain/common/models/model';
import {
  MemberCategoryEnum,
  MemberFileStatusEnum,
  MemberMaritalStatusEnum,
  MemberNationalityEnum,
  MemberSexEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { MemberAddressModel } from '@domain/members/models/member-address.model';
import {
  CreateMember,
  IMemberModel,
} from '@domain/members/models/member-model.interface';
import { UserModel } from '@domain/users/models/user.model';

export class MemberModel extends Model implements IMemberModel {
  public address: MemberAddressModel;

  public category: MemberCategoryEnum;

  public dateOfBirth: Date | null = null;

  public documentID: string | null = null;

  public fileStatus: MemberFileStatusEnum | null = null;

  public maritalStatus: MemberMaritalStatusEnum | null = null;

  public nationality: MemberNationalityEnum | null = null;

  public phones: string[] | null = null;

  public sex: MemberSexEnum | null = null;

  public status: MemberStatusEnum;

  public user: UserModel | null = null;

  public userId: string;

  public constructor(props?: IMemberModel) {
    super(props);

    if (props) {
      this.address = new MemberAddressModel(props.address);

      this.category = props.category;

      this.dateOfBirth = props.dateOfBirth;

      this.documentID = props.documentID;

      this.fileStatus = props.fileStatus;

      this.maritalStatus = props.maritalStatus;

      this.userId = props.userId;
    }
  }

  public static createOne(props: CreateMember): Result<MemberModel, Error> {
    const member = new MemberModel();

    const address = MemberAddressModel.createOne(props.address);

    if (address.isErr()) {
      return err(address.error);
    }

    member.userId = props.userId;

    return ok(member);
  }
}
