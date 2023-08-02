import SimpleSchema from 'simpl-schema';
import { Province } from '@domain/provinces/province.entity';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';

export const ProvincesCollection = new MongoCollection('provinces', Province);

// @ts-expect-error
ProvincesCollection.attachSchema(
  new SimpleSchema({
    _id: String,
    governmentId: String,
    latitude: Number,
    longitude: Number,
    name: String,
  })
);
