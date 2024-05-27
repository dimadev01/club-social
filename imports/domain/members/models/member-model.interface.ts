import { IModel } from '@domain/common/models/model.interface';

export interface IMemberModel extends IModel {
  userId: string;
}

export interface CreateMember {
  userId: string;
}
