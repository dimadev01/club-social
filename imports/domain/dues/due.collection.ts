import { MongoCollectionOld } from '@adapters/mongo/common/mongo-collection.old';
import { Due } from '@domain/dues/entities/due.entity';

export const DueCollectionOld = new MongoCollectionOld('dues.old', Due);
