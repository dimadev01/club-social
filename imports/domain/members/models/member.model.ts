import { Result, err, ok } from 'neverthrow';
import invariant from 'tiny-invariant';

import { DomainError } from '@domain/common/errors/domain.error';
import { InternalServerError } from '@domain/common/errors/internal-server.error';
import { Model } from '@domain/common/models/model';
import { BirthDate } from '@domain/common/value-objects/birth-date.value-object';
import {
  MemberCategoryEnum,
  MemberFileStatusEnum,
  MemberMaritalStatusEnum,
  MemberNationalityEnum,
  MemberSexEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { CreateMember, IMemberProps } from '@domain/members/member.interface';
import { MemberAddress } from '@domain/members/models/member-address.model';
import { User } from '@domain/users/models/user.model';

export class Member extends Model implements IMemberProps {
  private _address: MemberAddress;

  private _birthDate: BirthDate | null;

  private _category: MemberCategoryEnum;

  private _documentID: string | null;

  private _fileStatus: MemberFileStatusEnum | null;

  private _firstName: string;

  private _lastName: string;

  private _maritalStatus: MemberMaritalStatusEnum | null;

  private _nationality: MemberNationalityEnum | null;

  private _phones: string[] | null;

  private _sex: MemberSexEnum | null;

  private _status: MemberStatusEnum;

  private _userId: string;

  public user?: User;

  public constructor(props?: IMemberProps, user?: User) {
    super(props);

    this._address = new MemberAddress(props?.address);

    this._category = props?.category ?? MemberCategoryEnum.MEMBER;

    this._birthDate = props?.birthDate ?? null;

    this._documentID = props?.documentID ?? null;

    this._fileStatus = props?.fileStatus ?? null;

    this._maritalStatus = props?.maritalStatus ?? null;

    this._nationality = props?.nationality ?? null;

    this._phones = props?.phones ?? null;

    this._sex = props?.sex ?? null;

    this._status = props?.status ?? MemberStatusEnum.ACTIVE;

    this._userId = props?.userId ?? '';

    this._firstName = props?.firstName ?? '';

    this._lastName = props?.lastName ?? '';

    this.user = user;
  }

  public get address(): MemberAddress {
    return this._address;
  }

  public get birthDate(): BirthDate | null {
    return this._birthDate;
  }

  public get category(): MemberCategoryEnum {
    return this._category;
  }

  public get documentID(): string | null {
    return this._documentID;
  }

  public get fileStatus(): MemberFileStatusEnum | null {
    return this._fileStatus;
  }

  public get firstName(): string {
    return this._firstName;
  }

  public get lastName(): string {
    return this._lastName;
  }

  public get maritalStatus(): MemberMaritalStatusEnum | null {
    return this._maritalStatus;
  }

  public get name(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public get nameLastFirst(): string {
    return `${this.lastName} ${this.firstName}`;
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

  public get userId(): string {
    return this._userId;
  }

  public static createOne(props: CreateMember): Result<Member, Error> {
    const member = new Member();

    const address = MemberAddress.createOne(props.address);

    if (address.isErr()) {
      return err(address.error);
    }

    const result = Result.combine([
      member.setAddress(address.value),
      member.setCategory(props.category),
      member.setBirthDate(props.birthDate),
      member.setDocumentID(props.documentID),
      member.setFileStatus(props.fileStatus),
      member.setMaritalStatus(props.maritalStatus),
      member.setNationality(props.nationality),
      member.setUserId(props.userId),
      member.setPhones(props.phones),
      member.setSex(props.sex),
      member.setStatus(MemberStatusEnum.ACTIVE),
      member.setFirstName(props.firstName),
      member.setLastName(props.lastName),
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(member);
  }

  public firstEmail(): string {
    if (!this.hasEmail()) {
      throw new InternalServerError();
    }

    invariant(this.user);

    return this.user.emails[0].address;
  }

  public hasEmail(): boolean {
    invariant(this.user);

    return this.user.emails.length > 0;
  }

  public setAddress(value: MemberAddress): Result<null, Error> {
    this._address = value;

    return ok(null);
  }

  public setBirthDate(value: BirthDate | null): Result<null, Error> {
    if (value) {
      const isBirthDateInTheFuture = new Date() < value.toDate();

      if (isBirthDateInTheFuture) {
        return err(
          new DomainError('La fecha de nacimiento no puede ser futura'),
        );
      }

      const isBirthDateMoreThan80YearsAgo = value.getAge() > 80;

      if (isBirthDateMoreThan80YearsAgo) {
        return err(
          new DomainError(
            'La fecha de nacimiento no puede ser mayor a 80 años',
          ),
        );
      }
    }

    this._birthDate = value;

    return ok(null);
  }

  public setCategory(value: MemberCategoryEnum): Result<null, Error> {
    this._category = value;

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

  public setFirstName(value: string): Result<null, Error> {
    this._firstName = value;

    return ok(null);
  }

  public setLastName(value: string): Result<null, Error> {
    this._lastName = value;

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
