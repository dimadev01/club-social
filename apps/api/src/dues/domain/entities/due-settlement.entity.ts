import { BaseEntityProps, Entity } from '@/shared/domain/entity';
import { ApplicationError } from '@/shared/domain/errors/application.error';
import { err, ok, Result } from '@/shared/domain/result';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

export interface DueSettlementProps {
  amount: Amount; // positive
  dueId: UniqueId;
  ledgerEntryId: UniqueId; // the DEBIT entry that funded this settlement
  status: 'ACTIVE' | 'VOIDED';
}

export class DueSettlementEntity extends Entity<DueSettlementEntity> {
  public get amount(): Amount {
    return this._amount;
  }

  public get dueId(): UniqueId {
    return this._dueId;
  }

  public get ledgerEntryId() {
    return this._ledgerEntryId;
  }

  private _amount: Amount;
  private _dueId: UniqueId;
  private _ledgerEntryId: UniqueId;
  private _status: 'ACTIVE' | 'VOIDED';

  private constructor(props: DueSettlementProps, base?: BaseEntityProps) {
    super(base);
    this._dueId = props.dueId;
    this._ledgerEntryId = props.ledgerEntryId;
    this._amount = props.amount;
    this._status = props.status;
  }

  public static create(
    props: Omit<DueSettlementProps, 'status'>,
  ): Result<DueSettlementEntity> {
    if (props.amount.isNegative()) {
      return err(
        new ApplicationError('El monto del settlement debe ser positivo'),
      );
    }

    return ok(new DueSettlementEntity({ ...props, status: 'ACTIVE' }));
  }

  public isActive(): boolean {
    return this._status === 'ACTIVE';
  }

  public void(): void {
    this._status = 'VOIDED';
  }
}
