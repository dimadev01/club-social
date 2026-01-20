import {
  UpdateUserNotificationPreferencesDto,
  UserNotificationPreferencesDto,
} from '@club-social/shared/users';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserNotificationPreferencesRequestDto implements UpdateUserNotificationPreferencesDto {
  @IsBoolean()
  @IsOptional()
  public notifyOnDueCreated?: boolean;

  @IsBoolean()
  @IsOptional()
  public notifyOnMemberCreated?: boolean;

  @IsBoolean()
  @IsOptional()
  public notifyOnMovementCreated?: boolean;

  @IsBoolean()
  @IsOptional()
  public notifyOnMovementVoided?: boolean;

  @IsBoolean()
  @IsOptional()
  public notifyOnPaymentMade?: boolean;
}

export class UserNotificationPreferencesResponseDto implements UserNotificationPreferencesDto {
  public notifyOnDueCreated: boolean;
  public notifyOnMemberCreated: boolean;
  public notifyOnMovementCreated: boolean;
  public notifyOnMovementVoided: boolean;
  public notifyOnPaymentMade: boolean;
}
