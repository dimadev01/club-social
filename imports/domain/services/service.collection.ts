import SimpleSchema from 'simpl-schema';

import { MongoCollectionOld } from '@adapters/mongo/common/mongo-collection.old';
import { Service } from '@domain/services/service.entity';

export const ServicesCollection = new MongoCollectionOld('services', Service);

ServicesCollection.attachSchema(
  new SimpleSchema({
    _id: String,
    createdAt: Date,
    createdBy: String,
    description: { defaultValue: null, optional: true, type: String },
    name: String,
    updatedAt: { autoValue: () => new Date(), type: Date },
    updatedBy: String,
  }),
);

await ServicesCollection.createIndexAsync({ name: 1 });
