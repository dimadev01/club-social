import { MovementPaymentDto } from '@club-social/shared/movements';

export class MovementPaymentResponseDto implements MovementPaymentDto {
  public id: string;
  public receiptNumber: null | string;
}
