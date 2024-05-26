import { MemberDuePaymentGridDto } from './member-due-payment-grid.dto';

import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';

export class MemberDueGridDto {
  public _id: string;

  public amount: string;

  public category: DueCategoryEnum;

  public date: string;

  public debtAmount: string;

  public isDeleted: boolean;

  public isPaid: boolean;

  public isPartiallyPaid: boolean;

  public isPending: boolean;

  public membershipMonth: string;

  public paidAmount: string;

  public payments: MemberDuePaymentGridDto[] | null;

  public status: DueStatusEnum;
}
