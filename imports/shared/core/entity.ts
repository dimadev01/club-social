import { ID } from '@shared/core/id';
import { IEntity } from '@shared/core/types';

export abstract class Entity<Props> implements IEntity {
  private readonly _id: ID;

  protected props: Props;

  protected constructor(props: Props, id?: ID) {
    this.props = props;

    this._id = id ?? ID.create();
  }

  public get id(): ID {
    return this._id;
  }
}
