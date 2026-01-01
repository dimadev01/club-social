import { UniqueId } from './value-objects/unique-id/unique-id.vo';

export abstract class Entity {
  public get id(): UniqueId {
    return this._id;
  }

  protected constructor(
    protected readonly _id: UniqueId = UniqueId.generate(),
  ) {}

  public equals(other?: Entity): boolean {
    return !!other && this._id.equals(other._id);
  }
}
