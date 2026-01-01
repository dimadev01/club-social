import { ParamIdDto } from '@club-social/shared/types';
import { IsUUID } from 'class-validator';

export class ParamIdReqResDto implements ParamIdDto {
  @IsUUID()
  public id: string;
}
