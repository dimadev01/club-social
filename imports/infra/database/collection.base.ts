import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { Mongo } from 'meteor/mongo';
import { Entity } from '@domain/members/entity.base';

// @ts-ignore
export class Collection<T extends Entity> extends Mongo.Collection<T> {
  public constructor(name: string, cls: ClassConstructor<T>) {
    super(name, {
      transform: (doc) => plainToInstance(cls, doc),
    });
  }

  public updateEntity(entity: T): Promise<number> {
    return this.updateAsync(entity._id, {
      $set: instanceToPlain<T>(entity) as object,
    });
  }
}
