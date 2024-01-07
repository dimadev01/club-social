import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import { DuePaymentGridDto } from './due-payment-grid.dto';

export class DueGridDto {
  public _id: string;

  public amount: string;

  public category: DueCategoryEnum;

  public date: string;

  public debtAmount: string;

  public isDeleted: boolean;

  public isPaid: boolean;

  public isPartiallyPaid: boolean;

  public isPending: boolean;

  public memberId: string;

  public memberName: string;

  public membershipMonth: string;

  public paidAmount: string;

  public payments: DuePaymentGridDto[] | null;

  public status: DueStatusEnum;
}
