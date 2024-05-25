import { IsString } from 'class-validator';

export class GetPendingDuesRequestDto {
  @IsString()
  public memberId: string;
}
