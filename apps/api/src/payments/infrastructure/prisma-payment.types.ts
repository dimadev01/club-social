import {
  DueModel,
  DueSettlementModel,
  MemberModel,
  PaymentModel,
  UserModel,
} from '@/infrastructure/database/prisma/generated/models';

export type DueModelWithRelations = DueModel & {
  member?: MemberModelWithRelations;
};

export type MemberModelWithRelations = MemberModel & {
  user?: UserModel;
};

export type PaymentDueModelWithRelations = DueSettlementModel & {
  due?: DueModelWithRelations;
};

export type PaymentModelWithRelations = PaymentModel & {
  paymentDues?: PaymentDueModelWithRelations[];
};
