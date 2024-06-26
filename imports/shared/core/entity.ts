import { ID } from '@shared/core/id';
import { IEntity, UID } from '@shared/core/types';

export type EntityProps = {
  createdAt?: Date;
};

export abstract class Entity<Props extends EntityProps> implements IEntity {
  private readonly _id: UID;

  protected props: Props;

  protected constructor(props: Props, id?: UID) {
    this.props = { createdAt: new Date(), ...props };

    this._id = id ?? ID.create();
  }

  public get id(): UID {
    return this._id;
  }
}
