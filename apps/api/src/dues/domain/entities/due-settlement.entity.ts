import { DueSettlementStatus } from '@club-social/shared/dues';

import { Entity } from '@/shared/domain/entity';
import { ApplicationError } from '@/shared/domain/errors/application.error';
import { err, ok, Result } from '@/shared/domain/result';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

export interface DueSettlementProps {
  amount: Amount;
  dueId: UniqueId;
  memberLedgerEntryId: UniqueId;
  paymentId: null | UniqueId;
  status: DueSettlementStatus;
}

export class DueSettlementEntity extends Entity {
  public get amount(): Amount {
    return this._amount;
  }

  public get dueId(): UniqueId {
    return this._dueId;
  }

  public get memberLedgerEntryId() {
    return this._memberLedgerEntryId;
  }

  public get paymentId(): null | UniqueId {
    return this._paymentId;
  }

  public get status(): DueSettlementStatus {
    return this._status;
  }

  private _amount: Amount;
  private _dueId: UniqueId;
  private _memberLedgerEntryId: UniqueId;
  private _paymentId: null | UniqueId;
  private _status: DueSettlementStatus;

  private constructor(props: DueSettlementProps) {
    super();

    this._dueId = props.dueId;
    this._memberLedgerEntryId = props.memberLedgerEntryId;
    this._amount = props.amount;
    this._status = props.status;
    this._paymentId = props.paymentId;
  }

  public static create(
    props: Omit<DueSettlementProps, 'status'>,
  ): Result<DueSettlementEntity> {
    if (props.amount.isNegative()) {
      return err(
        new ApplicationError('El monto del settlement debe ser positivo'),
      );
    }

    return ok(
      new DueSettlementEntity({
        amount: props.amount,
        dueId: props.dueId,
        memberLedgerEntryId: props.memberLedgerEntryId,
        paymentId: props.paymentId,
        status: DueSettlementStatus.APPLIED,
      }),
    );
  }

  public static fromPersistence(
    props: DueSettlementProps,
  ): DueSettlementEntity {
    return new DueSettlementEntity(props);
  }

  public isApplied(): boolean {
    return this._status === DueSettlementStatus.APPLIED;
  }

  public void(): void {
    this._status = DueSettlementStatus.VOIDED;
  }
}
