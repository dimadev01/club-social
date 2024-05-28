import { IsNotEmpty, IsString } from 'class-validator';

import { GetMemberRequest } from '@domain/members/use-cases/get-member-new/get-member.request';

export class GetMemberRequestDto implements GetMemberRequest {
  @IsNotEmpty()
  @IsString()
  public id!: string;
}
