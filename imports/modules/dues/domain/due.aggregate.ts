import { Aggregate } from '@shared/core/aggregate';

export interface DueAggregateProps {
  amount: number;
  // date: Date;
  // notes?: string;
}

export class DueAggregate extends Aggregate<DueAggregateProps> {
  private constructor(props: DueAggregateProps) {
    super(props);
  }

  public get amount(): number {
    return this.props.amount;
  }

  public static create(props: DueAggregateProps): DueAggregate {
    return new DueAggregate(props);
  }
}
