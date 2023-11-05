import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Entity } from '@domain/common/entity';

export class MongoCollection<T extends Entity> extends Mongo.Collection<T> {
  public constructor(name: string, cls: ClassConstructor<T>) {
    super(name, {
      transform: (doc) => plainToInstance(cls, doc),
    });
  }

  public async insertEntity(entity: Mongo.OptionalId<T>): Promise<string> {
    const user: Meteor.User | null = await this._getCurrentUser();

    if (user) {
      // @ts-expect-error
      entity.create(`${user.profile?.firstName} ${user.profile?.lastName}`);
    }

    return this.insertAsync(entity);
  }

  public async updateEntity(entity: T): Promise<number> {
    const user: Meteor.User | null = await this._getCurrentUser();

    entity.update(
      // @ts-expect-error
      user ? `${user.profile?.firstName} ${user.profile?.lastName}` : 'System'
    );

    return this.updateAsync(entity._id, {
      $set: instanceToPlain<T>(entity) as object,
    });
  }

  private async _getCurrentUser(): Promise<Meteor.User | null> {
    try {
      return await Meteor.userAsync();
    } catch (error) {
      return null;
    }
  }
}
