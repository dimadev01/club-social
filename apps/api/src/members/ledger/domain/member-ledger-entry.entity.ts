import {
  MemberLedgerEntrySource,
  MemberLedgerEntryStatus,
  MemberLedgerEntryType,
} from '@club-social/shared/members';

import { AuditedAggregateRoot } from '@/shared/domain/audited-aggregate-root';
import { PersistenceMeta } from '@/shared/domain/persistence-meta';
import { ok, Result } from '@/shared/domain/result';
import { SignedAmount } from '@/shared/domain/value-objects/amount/signed-amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

interface MemberLedgerEntryProps {
  amount: SignedAmount;
  date: DateOnly;
  memberId: UniqueId;
  notes: null | string;
  paymentId: null | UniqueId;
  reversalOfId: null | UniqueId;
  source: MemberLedgerEntrySource;
  status: MemberLedgerEntryStatus;
  type: MemberLedgerEntryType;
}

export class MemberLedgerEntryEntity extends AuditedAggregateRoot {
  public get amount(): SignedAmount {
    return this._amount;
  }

  public get date(): DateOnly {
    return this._date;
  }

  public get memberId(): UniqueId {
    return this._memberId;
  }

  public get notes(): null | string {
    return this._notes;
  }

  public get paymentId(): null | UniqueId {
    return this._paymentId;
  }

  public get reversalOfId(): null | UniqueId {
    return this._reversalOfId;
  }

  public get source(): MemberLedgerEntrySource {
    return this._source;
  }

  public get status(): MemberLedgerEntryStatus {
    return this._status;
  }

  public get type(): MemberLedgerEntryType {
    return this._type;
  }

  private _amount: SignedAmount;
  private _date: DateOnly;
  private _memberId: UniqueId;
  private _notes: null | string;
  private _paymentId: null | UniqueId;
  private _reversalOfId: null | UniqueId;
  private _source: MemberLedgerEntrySource;
  private _status: MemberLedgerEntryStatus;
  private _type: MemberLedgerEntryType;

  private constructor(props: MemberLedgerEntryProps, meta?: PersistenceMeta) {
    super(meta?.id, meta?.audit);

    this._amount = props.amount;
    this._date = props.date;
    this._memberId = props.memberId;
    this._notes = props.notes;
    this._paymentId = props.paymentId;
    this._reversalOfId = props.reversalOfId;
    this._status = props.status;
    this._type = props.type;
    this._source = props.source;
  }

  public static create(
    props: MemberLedgerEntryProps,
    createdBy: string,
  ): Result<MemberLedgerEntryEntity> {
    const entity = new MemberLedgerEntryEntity(props, {
      audit: { createdBy },
      id: UniqueId.generate(),
    });

    return ok(entity);
  }

  public static fromPersistence(
    props: MemberLedgerEntryProps,
    meta: PersistenceMeta,
  ): MemberLedgerEntryEntity {
    return new MemberLedgerEntryEntity(props, meta);
  }

  public clone(): MemberLedgerEntryEntity {
    return MemberLedgerEntryEntity.fromPersistence(
      {
        amount: this._amount,
        date: this._date,
        memberId: this._memberId,
        notes: this._notes,
        paymentId: this._paymentId,
        reversalOfId: this._reversalOfId,
        source: this._source,
        status: this._status,
        type: this._type,
      },
      {
        audit: { ...this._audit },
        id: this.id,
      },
    );
  }

  public reverse() {
    this._status = MemberLedgerEntryStatus.REVERSED;
  }
}
