import { Id } from '@shared/core/id';
import { IEntity, IId } from '@shared/core/types';

export type EntityProps = {
  createdAt?: Date;
};

export abstract class Entity<Props extends EntityProps> implements IEntity {
  private readonly _id: IId;

  protected props: Props;

  protected constructor(props: Props, id?: IId) {
    this.props = { createdAt: new Date(), ...props };

    this._id = id ?? Id.create();
  }

  public get id(): IId {
    return this._id;
  }
}
