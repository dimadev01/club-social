import { Result, ok } from 'neverthrow';

import { Id } from '@shared/core/id';

export interface DueAggregateProps {
  amount: number;
  createdAt?: Date;
  id?: Id;
}

export class DueAggregate {
  private _amount: number;

  private _createdAt: Date;

  private _id: Id;

  private constructor(props: DueAggregateProps) {
    this._id = props.id ?? Id.create();

    this._createdAt = props.createdAt ?? new Date();

    this._amount = props.amount;
  }

  public static create(props: DueAggregateProps): Result<DueAggregate, Error> {
    return ok(new DueAggregate(props));
  }
}
