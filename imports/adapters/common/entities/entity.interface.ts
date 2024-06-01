import { IUniqueIdEntity } from '@adapters/common/entities/unique-id-entity.interface';

export interface IEntity extends IUniqueIdEntity {
  createdAt: Date;
  createdBy: string;
  deletedAt: Date | null;
  deletedBy: string | null;
  isDeleted: boolean;
  updatedAt: Date;
  updatedBy: string;
}
