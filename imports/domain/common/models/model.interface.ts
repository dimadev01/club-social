import { IUniqueID } from './unique-id-model.interface';

import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';

export interface IModel extends IUniqueID {
  createdAt: DateTimeVo;
  createdBy: string;
  deletedAt: DateTimeVo | null;
  deletedBy: string | null;
  isDeleted: boolean;
  updatedAt: DateTimeVo;
  updatedBy: string;
}
