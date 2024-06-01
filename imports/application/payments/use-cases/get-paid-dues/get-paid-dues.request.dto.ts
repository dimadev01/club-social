import { IsNotEmpty, IsString } from 'class-validator';

export class GetPaidDuesRequestDto {
  @IsNotEmpty()
  @IsString()
  public memberId: string;
}
