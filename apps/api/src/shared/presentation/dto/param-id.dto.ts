import { ParamId } from '@club-social/shared/types';
import { IsUUID } from 'class-validator';

export class ParamIdDto implements ParamId {
  @IsUUID()
  public id: string;
}
