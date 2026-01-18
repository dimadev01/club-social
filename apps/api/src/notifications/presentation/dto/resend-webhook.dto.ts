import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

const ResendWebhookEventType = {
  EMAIL_BOUNCED: 'email.bounced',
  EMAIL_COMPLAINED: 'email.complained',
  EMAIL_DELIVERED: 'email.delivered',
} as const;

type ResendWebhookEventType =
  (typeof ResendWebhookEventType)[keyof typeof ResendWebhookEventType];

class ResendWebhookDataDto {
  @IsString()
  public email_id: string;

  @IsArray()
  @IsString({ each: true })
  public to: string[];
}

export class ResendWebhookDto {
  @IsObject()
  @Type(() => ResendWebhookDataDto)
  @ValidateNested()
  public data: ResendWebhookDataDto;

  @IsIn(Object.values(ResendWebhookEventType))
  public type: ResendWebhookEventType;
}
