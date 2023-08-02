import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { FullEntity } from '@domain/common/full-entity.base';

export class MongoCollection<T extends FullEntity> extends Mongo.Collection<T> {
  public constructor(name: string, cls: ClassConstructor<T>) {
    super(name, {
      transform: (doc) => plainToInstance(cls, doc),
    });
  }

  public insertEntity(entity: Mongo.OptionalId<T>): Promise<string> {
    const user: Meteor.User | null = this._getCurrentUser();

    if (user) {
      // @ts-expect-error
      entity.create(`${user.profile?.firstName} ${user.profile?.lastName}`);
    }

    return this.insertAsync(entity);
  }

  public updateEntity(entity: T): Promise<number> {
    const user: Meteor.User | null = this._getCurrentUser();

    entity.update(
      // @ts-expect-error
      user ? `${user.profile?.firstName} ${user.profile?.lastName}` : 'System'
    );

    return this.updateAsync(entity._id, {
      $set: instanceToPlain<T>(entity) as object,
    });
  }

  private _getCurrentUser(): Meteor.User | null {
    try {
      return Meteor.user();
    } catch (error) {
      return null;
    }
  }
}
