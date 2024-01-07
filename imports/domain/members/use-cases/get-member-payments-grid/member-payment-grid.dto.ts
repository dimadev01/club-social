import { MemberPaymentDueGridDto } from './member-payment-due-grid.dto';

export class MemberPaymentGridDto {
  public _id: string;

  public date: string;

  public dues: MemberPaymentDueGridDto[];

  public count: number;

  public totalAmount: string;

  public isDeleted: boolean;
}
