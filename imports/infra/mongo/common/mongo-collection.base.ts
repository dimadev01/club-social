import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Entity } from '@domain/common/entity';

export class MongoCollection<T extends Entity> extends Mongo.Collection<T> {
  public constructor(name: string, cls: ClassConstructor<T>) {
    super(name, {
      transform: (doc) => plainToInstance(cls, doc),
    });
  }

  public attachSchema(schema: SimpleSchema): void {
    // @ts-expect-error
    super.attachSchema(schema);
  }

  public async insertEntity(entity: Mongo.OptionalId<T>): Promise<string> {
    const user: Meteor.User | null = await this._getCurrentUser();

    if (user) {
      entity.create(`${user.profile?.firstName} ${user.profile?.lastName}`);
    }

    return this.insertAsync(entity);
  }

  public async updateEntity(entity: T): Promise<number> {
    const user: Meteor.User | null = await this._getCurrentUser();

    entity.update(
      user ? `${user.profile?.firstName} ${user.profile?.lastName}` : 'System',
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
