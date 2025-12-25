import {
  DueModel,
  MemberModel,
  PaymentDueModel,
  PaymentModel,
  UserModel,
} from '@/infrastructure/database/prisma/generated/models';

export type DueModelWithRelations = DueModel & {
  member?: MemberModelWithRelations;
};

export interface GetPaymentStatisticsParams {
  dateRange?: [string, string];
}

export type MemberModelWithRelations = MemberModel & {
  user?: UserModel;
};

export type PaymentDueModelWithRelations = PaymentDueModel & {
  due?: DueModelWithRelations;
};

export type PaymentModelWithRelations = PaymentModel & {
  paymentDues?: PaymentDueModelWithRelations[];
};
