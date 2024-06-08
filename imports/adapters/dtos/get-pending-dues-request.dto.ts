import { IsNotEmpty, IsString } from 'class-validator';

import { FindPendingDues } from '@domain/dues/due.repository';

export class GetPendingDuesRequestDto implements FindPendingDues {
  @IsNotEmpty()
  @IsString()
  public memberId!: string;
}
