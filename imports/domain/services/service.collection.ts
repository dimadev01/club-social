import SimpleSchema from 'simpl-schema';
import { Service } from '@domain/services/service.entity';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';

export const ServicesCollection = new MongoCollection('services', Service);

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
