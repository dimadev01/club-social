import SimpleSchema from 'simpl-schema';
import { Professor } from '@domain/professors/professor.entity';
import { Collection } from '@infra/database/collection.base';

export const ProfessorsCollection = new Collection('professors', Professor);

// @ts-expect-error
ProfessorsCollection.attachSchema(
  new SimpleSchema({
    _id: String,
    createdAt: Date,
    createdBy: String,
    updatedAt: { autoValue: () => new Date(), type: Date },
    updatedBy: String,
    userId: String,
  })
);

await ProfessorsCollection.createIndexAsync({ userId: 1 });
