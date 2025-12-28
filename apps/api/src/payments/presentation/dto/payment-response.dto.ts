import {
  PaymentDto,
  PaymentMemberDto,
  PaymentStatus,
} from '@club-social/shared/payments';

export class PaymentMemberResponseDto implements PaymentMemberDto {
  public id: string;
  public name: string;
}

export class PaymentResponseDto implements PaymentDto {
  public amount: number;
  public createdAt: string;
  public createdBy: string;
  public date: string;
  public id: string;
  public member: PaymentMemberResponseDto;
  public memberId: string;
  public memberName: string;
  public notes: null | string;
  public receiptNumber: null | string;
  public status: PaymentStatus;
  public updatedAt: string;
  public updatedBy?: null | string;
  public voidedAt: null | string;
  public voidedBy: null | string;
  public voidReason: null | string;
}
