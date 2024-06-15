import { IsNotEmpty, IsString } from 'class-validator';

import { FindPendingDues } from '@application/dues/repositories/due.repository';

export class GetPendingDuesRequestDto implements FindPendingDues {
  @IsNotEmpty()
  @IsString()
  public memberId!: string;
}
