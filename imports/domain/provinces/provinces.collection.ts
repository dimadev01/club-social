import SimpleSchema from 'simpl-schema';
import { Province } from '@domain/provinces/province.entity';
import { Collection } from '@infra/database/collection.base';

export const ProvincesCollection = new Collection('provinces', Province);

// @ts-ignore
ProvincesCollection.attachSchema(
  new SimpleSchema({
    _id: String,
    governmentId: String,
    latitude: Number,
    longitude: Number,
    name: String,
  })
);
