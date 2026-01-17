import { UpdateMemberNotificationPreferencesDto } from '@club-social/shared/members';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateMemberNotificationPreferencesRequestDto implements UpdateMemberNotificationPreferencesDto {
  @IsBoolean()
  @IsOptional()
  public notifyOnDueCreated?: boolean;

  @IsBoolean()
  @IsOptional()
  public notifyOnPaymentMade?: boolean;
}
