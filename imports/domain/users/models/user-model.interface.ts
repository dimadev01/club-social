import { IModel } from '@domain/common/models/model.interface';

export interface IUserModel extends IModel {
  firstName: string;
}

export interface CreateUser {
  firstName: string;
}
