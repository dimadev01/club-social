import {
  FileStatus,
  MaritalStatus,
  MemberCategory,
  MemberNationality,
  MemberSex,
  MemberStatus,
} from '@club-social/shared/members';

import { AuditedAggregateRoot } from '@/shared/domain/audited-aggregate-root';
import { PersistenceMeta } from '@/shared/domain/persistence-meta';
import { ok, Result } from '@/shared/domain/result';
import { Address } from '@/shared/domain/value-objects/address/address.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { StrictOmit } from '@/shared/types/type-utils';
import { UserEntity } from '@/users/domain/entities/user.entity';

import { MemberCreatedEvent } from '../events/member-created.event';
import { MemberUpdatedEvent } from '../events/member-updated.event';
import { MemberNotification } from '../value-objects/member-notification.vo';

export interface MemberProps {
  address: Address | null;
  birthDate: DateOnly | null;
  category: MemberCategory;
  documentID: null | string;
  fileStatus: FileStatus;
  maritalStatus: MaritalStatus | null;
  nationality: MemberNationality | null;
  notificationPreferences: MemberNotification;
  phones: string[];
  sex: MemberSex | null;
  status: MemberStatus;
  userId: UniqueId;
}

export class MemberEntity extends AuditedAggregateRoot {
  public get address(): Address | null {
    return this._address;
  }

  public get birthDate(): DateOnly | null {
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

  public get notificationPreferences(): MemberNotification {
    return this._notificationPreferences;
  }

  public get phones(): string[] {
    return this._phones;
  }

  public get sex(): MemberSex | null {
    return this._sex;
  }

  public get status(): MemberStatus {
    return this._status;
  }

  public get userId(): UniqueId {
    return this._userId;
  }

  private _address: Address | null;
  private _birthDate: DateOnly | null;
  private _category: MemberCategory;
  private _documentID: null | string;
  private _fileStatus: FileStatus;
  private _maritalStatus: MaritalStatus | null;
  private _nationality: MemberNationality | null;
  private _notificationPreferences: MemberNotification;
  private _phones: string[];
  private _sex: MemberSex | null;
  private _status: MemberStatus;
  private _userId: UniqueId;

  private constructor(props: MemberProps, meta?: PersistenceMeta) {
    super(meta?.id, meta?.audit);

    this._address = props.address;
    this._birthDate = props.birthDate;
    this._category = props.category;
    this._documentID = props.documentID;
    this._fileStatus = props.fileStatus;
    this._maritalStatus = props.maritalStatus;
    this._nationality = props.nationality;
    this._notificationPreferences = props.notificationPreferences;
    this._phones = props.phones;
    this._sex = props.sex;
    this._status = props.status;
    this._userId = props.userId;
  }

  public static create(
    props: StrictOmit<MemberProps, 'notificationPreferences' | 'status'> & {
      notificationPreferences?: MemberNotification;
    },
    user: UserEntity,
  ): Result<MemberEntity> {
    const member = new MemberEntity(
      {
        ...props,
        notificationPreferences: MemberNotification.raw(),
        status: MemberStatus.ACTIVE,
      },
      {
        audit: { createdBy: user.createdBy },
        id: UniqueId.generate(),
      },
    );

    member.addEvent(new MemberCreatedEvent(member, user));

    return ok(member);
  }

  public static fromPersistence(
    props: MemberProps,
    meta: PersistenceMeta,
  ): MemberEntity {
    return new MemberEntity(props, meta);
  }

  public clone(): MemberEntity {
    return MemberEntity.fromPersistence(
      {
        address: this._address,
        birthDate: this._birthDate,
        category: this._category,
        documentID: this._documentID,
        fileStatus: this._fileStatus,
        maritalStatus: this._maritalStatus,
        nationality: this._nationality,
        notificationPreferences: this._notificationPreferences,
        phones: [...this._phones],
        sex: this._sex,
        status: this._status,
        userId: this._userId,
      },
      {
        audit: { ...this._audit },
        id: this.id,
      },
    );
  }

  public updateProfile(props: {
    address: Address | null;
    birthDate: DateOnly | null;
    category: MemberCategory;
    documentID: null | string;
    fileStatus: FileStatus;
    maritalStatus: MaritalStatus | null;
    nationality: MemberNationality | null;
    notificationPreferences: MemberNotification;
    phones: string[];
    sex: MemberSex | null;
    status: MemberStatus;
    updatedBy: string;
  }) {
    const oldMember = this.clone();

    this._address = props.address;
    this._birthDate = props.birthDate;
    this._category = props.category;
    this._documentID = props.documentID;
    this._fileStatus = props.fileStatus;
    this._maritalStatus = props.maritalStatus;
    this._nationality = props.nationality;
    this._notificationPreferences = props.notificationPreferences;
    this._status = props.status;
    this._phones = props.phones;
    this._sex = props.sex;

    this.markAsUpdated(props.updatedBy);
    this.addEvent(new MemberUpdatedEvent(oldMember, this));
  }
}
