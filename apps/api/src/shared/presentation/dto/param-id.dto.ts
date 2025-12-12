import { IsUUID } from 'class-validator';

export class IdDto {
  @IsUUID()
  public id: string;
}
