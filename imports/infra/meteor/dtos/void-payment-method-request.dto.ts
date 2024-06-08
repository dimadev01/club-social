import { GetOneByIdRequestDto } from '@adapters/common/dtos/get-one-dto-request.dto';

export interface VoidPaymentMethodRequestDto extends GetOneByIdRequestDto {
  voidReason: string;
}
