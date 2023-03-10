import SimpleSchema from 'simpl-schema';
import { Province } from '@domain/provinces/province.entity';
import { Collection } from '@infra/database/collection.base';

export const ProvincesCollection = new Collection('provinces', Province);

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
