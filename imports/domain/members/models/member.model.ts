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

  public dateOfBirth: Date | null;

  public documentID: string | null;

  public fileStatus: MemberFileStatusEnum | null;

  public maritalStatus: MemberMaritalStatusEnum | null;

  public nationality: MemberNationalityEnum | null;

  public phones: string[] | null;

  public sex: MemberSexEnum | null;

  public status: MemberStatusEnum;

  public user: UserModel | null;

  public userId: string;

  public constructor(props?: IMemberModel) {
    super(props);

    this.address = new MemberAddressModel(props?.address);

    this.category = props?.category ?? MemberCategoryEnum.MEMBER;

    this.dateOfBirth = props?.dateOfBirth ?? null;

    this.documentID = props?.documentID ?? null;

    this.fileStatus = props?.fileStatus ?? null;

    this.maritalStatus = props?.maritalStatus ?? null;

    this.nationality = props?.nationality ?? null;

    this.phones = props?.phones ?? null;

    this.sex = props?.sex ?? null;

    this.status = props?.status ?? MemberStatusEnum.ACTIVE;

    this.user = props?.user ?? null;

    this.userId = props?.userId ?? '';
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
