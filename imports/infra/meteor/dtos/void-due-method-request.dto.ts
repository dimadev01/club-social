import { GetOneByIdRequestDto } from '@ui/common/dtos/get-one-dto-request.dto';

export interface VoidDueMethodRequestDto extends GetOneByIdRequestDto {
  voidReason: string;
}
