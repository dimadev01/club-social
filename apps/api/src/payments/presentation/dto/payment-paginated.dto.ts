import { DueCategory } from '@club-social/shared/dues';
import {
  PaymentPaginatedDto,
  PaymentPaginatedExtraDto,
  PaymentStatus,
} from '@club-social/shared/payments';

export class PaymentPaginatedExtraResponseDto implements PaymentPaginatedExtraDto {
  public totalAmount: number;
}

export class PaymentPaginatedResponseDto implements PaymentPaginatedDto {
  public amount: number;
  public categories: DueCategory[];
  public createdAt: string;
  public createdBy: string;
  public date: string;
  public id: string;
  public memberId: string;
  public memberName: string;
  public receiptNumber: null | string;
  public status: PaymentStatus;
}
