import SimpleSchema from 'simpl-schema';

import { MongoCollectionOld } from '@adapters/mongo/common/mongo-collection.old';
import { Employee } from '@domain/employees/employee.entity';

export const EmployeesCollection = new MongoCollectionOld(
  'employees',
  Employee,
);

EmployeesCollection.attachSchema(
  new SimpleSchema({
    _id: String,
    createdAt: Date,
    createdBy: String,
    updatedAt: { autoValue: () => new Date(), type: Date },
    updatedBy: String,
    userId: String,
  }),
);

await EmployeesCollection.createIndexAsync({ userId: 1 });
