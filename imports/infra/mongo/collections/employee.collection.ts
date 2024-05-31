import SimpleSchema from 'simpl-schema';

import { Employee } from '@domain/employees/employee.entity';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.old';

export const EmployeesCollection = new MongoCollection('employees', Employee);

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
