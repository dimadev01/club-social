import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
/* eslint-disable no-param-reassign */
import { Entity } from '@kernel/entity.base';
import { FullEntity } from '@kernel/full-entity.base';

// @ts-ignore
export class Collection<T extends Entity> extends Mongo.Collection<T> {
  public constructor(name: string, cls: ClassConstructor<T>) {
    super(name, {
      transform: (doc) => plainToInstance(cls, doc),
    });
  }

  public insertEntity(entity: Mongo.OptionalId<T>): Promise<string> {
    const user: Meteor.User | null = this._getCurrentUser();

    if (user) {
      // @ts-expect-error
      entity.createdBy = `${user.profile?.firstName} ${user.profile?.lastName}`;

      if (entity instanceof FullEntity) {
        entity.updatedBy = entity.createdBy;
      }
    }

    return this.insertAsync(entity);
  }

  public updateEntity(entity: T): Promise<number> {
    const user: Meteor.User | null = this._getCurrentUser();

    if (user) {
      // @ts-expect-error
      entity.updatedBy = `${user.profile?.firstName} ${user.profile?.lastName}`;
    } else if (entity instanceof FullEntity) {
      entity.updatedBy = 'System';
    }

    if (entity instanceof FullEntity) {
      entity.updatedAt = new Date();
    }

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
