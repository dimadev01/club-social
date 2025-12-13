import {
  FileStatus,
  MaritalStatus,
  MemberCategory,
  MemberNationality,
  MemberSex,
} from '@club-social/shared/members';

import type { BaseEntityProps } from '@/shared/domain/entity';

import { Entity } from '@/shared/domain/entity';
import { ok, Result } from '@/shared/domain/result';
import { Address } from '@/shared/domain/value-objects/address/address.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { MemberCreatedEvent } from '../events/member-created.event';
import { MemberUpdatedEvent } from '../events/member-updated.event';
import { UpdateMemberProfileProps } from '../interfaces/member.interface';

interface MemberProps {
  address: Address | null;
  birthDate: Date | null;
  category: MemberCategory;
  createdBy: string;
  documentID: null | string;
  fileStatus: FileStatus;
  maritalStatus: MaritalStatus | null;
  nationality: MemberNationality | null;
  phones: string[];
  sex: MemberSex | null;
  userId: UniqueId;
}

export class MemberEntity extends Entity<MemberEntity> {
  public get address(): Address | null {
    return this._address;
  }

  public get birthDate(): Date | null {
    return this._birthDate;
  }

  public get category(): MemberCategory {
    return this._category;
  }

  public get documentID(): null | string {
    return this._documentID;
  }

  public get fileStatus(): FileStatus {
    return this._fileStatus;
  }

  public get maritalStatus(): MaritalStatus | null {
    return this._maritalStatus;
  }

  public get nationality(): MemberNationality | null {
    return this._nationality;
  }

  public get phones(): string[] {
    return this._phones;
  }

  public get sex(): MemberSex | null {
    return this._sex;
  }

  public get userId(): UniqueId {
    return this._userId;
  }

  private _address: Address | null;
  private _birthDate: Date | null;
  private _category: MemberCategory;
  private _documentID: null | string;
  private _fileStatus: FileStatus;
  private _maritalStatus: MaritalStatus | null;
  private _nationality: MemberNationality | null;
  private _phones: string[];
  private _sex: MemberSex | null;
  private _userId: UniqueId;

  private constructor(props: MemberProps, base?: BaseEntityProps) {
    super(base);

    this._address = props.address;
    this._birthDate = props.birthDate;
    this._category = props.category;
    this._documentID = props.documentID;
    this._fileStatus = props.fileStatus;
    this._maritalStatus = props.maritalStatus;
    this._nationality = props.nationality;
    this._phones = props.phones;
    this._sex = props.sex;
    this._userId = props.userId;
    this._createdBy = props.createdBy;
  }

  public static create(props: MemberProps): Result<MemberEntity> {
    const member = new MemberEntity({
      address: props.address,
      birthDate: props.birthDate,
      category: props.category,
      createdBy: props.createdBy,
      documentID: props.documentID,
      fileStatus: props.fileStatus,
      maritalStatus: props.maritalStatus,
      nationality: props.nationality,
      phones: props.phones,
      sex: props.sex,
      userId: props.userId,
    });

    member.addEvent(new MemberCreatedEvent(member));

    return ok(member);
  }

  public static fromPersistence(
    props: MemberProps,
    base: BaseEntityProps,
  ): MemberEntity {
    return new MemberEntity(props, base);
  }

  public updateProfile(props: UpdateMemberProfileProps) {
    this._address = props.address;
    this._birthDate = props.birthDate;
    this._category = props.category;
    this._documentID = props.documentID;
    this._fileStatus = props.fileStatus;
    this._maritalStatus = props.maritalStatus;
    this._nationality = props.nationality;
    this._phones = props.phones;
    this._sex = props.sex;
    this.markAsUpdated(props.updatedBy);

    this.addEvent(new MemberUpdatedEvent(this.id, props));
  }
}
