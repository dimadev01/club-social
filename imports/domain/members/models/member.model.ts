import { Result, err, ok } from 'neverthrow';
import invariant from 'tiny-invariant';

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
import { DateUtils } from '@shared/utils/date.utils';

export class MemberModel extends Model implements IMemberModel {
  private _address: MemberAddressModel;

  private _category: MemberCategoryEnum;

  private _dateOfBirth: Date | null;

  private _documentID: string | null;

  private _fileStatus: MemberFileStatusEnum | null;

  private _maritalStatus: MemberMaritalStatusEnum | null;

  private _nationality: MemberNationalityEnum | null;

  private _phones: string[] | null;

  private _sex: MemberSexEnum | null;

  private _status: MemberStatusEnum;

  private _user: UserModel | undefined;

  private _userId: string;

  public constructor(props?: IMemberModel) {
    super(props);

    this._address = new MemberAddressModel(props?.address);

    this._category = props?.category ?? MemberCategoryEnum.MEMBER;

    this._dateOfBirth = props?.dateOfBirth ?? null;

    this._documentID = props?.documentID ?? null;

    this._fileStatus = props?.fileStatus ?? null;

    this._maritalStatus = props?.maritalStatus ?? null;

    this._nationality = props?.nationality ?? null;

    this._phones = props?.phones ?? null;

    this._sex = props?.sex ?? null;

    this._status = props?.status ?? MemberStatusEnum.ACTIVE;

    this._userId = props?.userId ?? '';

    this._user = props?.user;
  }

  public get address(): MemberAddressModel {
    return this._address;
  }

  public get category(): MemberCategoryEnum {
    return this._category;
  }

  public get dateOfBirth(): Date | null {
    return this._dateOfBirth;
  }

  public get documentID(): string | null {
    return this._documentID;
  }

  public get fileStatus(): MemberFileStatusEnum | null {
    return this._fileStatus;
  }

  public get maritalStatus(): MemberMaritalStatusEnum | null {
    return this._maritalStatus;
  }

  public get name(): string {
    invariant(this.user);

    return this.user.name;
  }

  public get nationality(): MemberNationalityEnum | null {
    return this._nationality;
  }

  public get phones(): string[] | null {
    return this._phones;
  }

  public get sex(): MemberSexEnum | null {
    return this._sex;
  }

  public get status(): MemberStatusEnum {
    return this._status;
  }

  public get user(): UserModel | undefined {
    return this._user;
  }

  public set user(value: UserModel | undefined) {
    this._user = value;
  }

  public get userId(): string {
    return this._userId;
  }

  public static createOne(props: CreateMember): Result<MemberModel, Error> {
    const member = new MemberModel();

    const address = MemberAddressModel.createOne(props.address);

    if (address.isErr()) {
      return err(address.error);
    }

    const result = Result.combine([
      member.setAddress(address.value),
      member.setCategory(props.category),
      member.setDateOfBirth(props.dateOfBirth),
      member.setDocumentID(props.documentID),
      member.setFileStatus(props.fileStatus),
      member.setMaritalStatus(props.maritalStatus),
      member.setNationality(props.nationality),
      member.setUserId(props.userId),
      member.setPhones(props.phones),
      member.setSex(props.sex),
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(member);
  }

  public setAddress(value: MemberAddressModel): Result<null, Error> {
    this._address = value;

    return ok(null);
  }

  public setCategory(value: MemberCategoryEnum): Result<null, Error> {
    this._category = value;

    return ok(null);
  }

  public setDateOfBirth(value: string | null): Result<null, Error> {
    if (value) {
      this._dateOfBirth = DateUtils.utc(value).toDate();
    } else {
      this._dateOfBirth = null;
    }

    return ok(null);
  }

  public setDocumentID(value: string | null): Result<null, Error> {
    this._documentID = value;

    return ok(null);
  }

  public setFileStatus(
    value: MemberFileStatusEnum | null,
  ): Result<null, Error> {
    this._fileStatus = value;

    return ok(null);
  }

  public setMaritalStatus(
    value: MemberMaritalStatusEnum | null,
  ): Result<null, Error> {
    this._maritalStatus = value;

    return ok(null);
  }

  public setNationality(
    value: MemberNationalityEnum | null,
  ): Result<null, Error> {
    this._nationality = value;

    return ok(null);
  }

  public setPhones(value: string[] | null): Result<null, Error> {
    this._phones = value;

    return ok(null);
  }

  public setSex(value: MemberSexEnum | null): Result<null, Error> {
    this._sex = value;

    return ok(null);
  }

  public setStatus(value: MemberStatusEnum): Result<null, Error> {
    this._status = value;

    return ok(null);
  }

  public setUserId(value: string): Result<null, Error> {
    this._userId = value;

    return ok(null);
  }
}
