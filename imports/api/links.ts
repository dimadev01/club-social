import { Mongo } from 'meteor/mongo';

export interface Link {
  _id?: string;
  createdAt: Date;
  title: string;
  url: string;
}

export const LinksCollection = new Mongo.Collection<Link>('links');
