import { IUniqueIDProps } from './unique-id-model.interface';

export interface IModelProps extends IUniqueIDProps {
  createdAt: Date;
  createdBy: string;
  deletedAt: Date | null;
  deletedBy: string | null;
  isDeleted: boolean;
  updatedAt: Date;
  updatedBy: string;
}
