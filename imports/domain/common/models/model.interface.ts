import { IUniqueIDModel } from './unique-id-model.interface';

export interface IModel extends IUniqueIDModel {
  createdAt: Date;
  createdBy: string;
  deletedAt: Date | null;
  deletedBy: string | null;
  isDeleted: boolean;
  updatedAt: Date;
  updatedBy: string;
}
