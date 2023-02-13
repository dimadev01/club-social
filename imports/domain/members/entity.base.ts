import { Random } from 'meteor/random';

export class Entity {
  _id: string;

  createdAt: Date;

  updatedAt: Date;

  protected constructor() {
    this._id = Random.id();

    this.createdAt = new Date();

    this.updatedAt = new Date();
  }
}
