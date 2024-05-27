import SimpleSchema from 'simpl-schema';

import { Professor } from '@domain/professors/professor.entity';
import { MongoCollectionOld } from '@infra/mongo/common/mongo-collection.old';

export const ProfessorsCollection = new MongoCollectionOld(
  'professors',
  Professor,
);

ProfessorsCollection.attachSchema(
  new SimpleSchema({
    _id: String,
    createdAt: Date,
    createdBy: String,
    updatedAt: { autoValue: () => new Date(), type: Date },
    updatedBy: String,
    userId: String,
  }),
);

await ProfessorsCollection.createIndexAsync({ userId: 1 });
