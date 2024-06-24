import { Result, ok } from 'neverthrow';

import { ID } from '@shared/core/id';

export interface DueAggregateProps {
  amount: number;
  createdAt?: Date;
  id?: ID;
}

export class DueAggregate {
  private _amount: number;

  private _createdAt: Date;

  private _id: ID;

  private constructor(props: DueAggregateProps) {
    this._id = props.id ?? ID.create();

    this._createdAt = props.createdAt ?? new Date();

    this._amount = props.amount;
  }

  public static create(props: DueAggregateProps): Result<DueAggregate, Error> {
    return ok(new DueAggregate(props));
  }
}
