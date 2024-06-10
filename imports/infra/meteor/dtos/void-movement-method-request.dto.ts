import { GetOneByIdRequestDto } from '@adapters/common/dtos/get-one-dto-request.dto';

export interface VoidMovementMethodRequestDto extends GetOneByIdRequestDto {
  voidReason: string;
}
