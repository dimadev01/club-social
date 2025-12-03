import { IsUUID } from 'class-validator';

export class ParamIdDto {
  @IsUUID()
  public id: string;
}
