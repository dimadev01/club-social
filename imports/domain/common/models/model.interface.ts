import { IUniqueID } from './unique-id-model.interface';

export interface IModel extends IUniqueID {
  createdAt: Date;
  createdBy: string;
  deletedAt: Date | null;
  deletedBy: string | null;
  isDeleted: boolean;
  updatedAt: Date;
  updatedBy: string;
}
