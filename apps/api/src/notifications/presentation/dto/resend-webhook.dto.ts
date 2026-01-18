import { IsObject, IsString } from 'class-validator';

import { ResendWebhookEventType } from '@/infrastructure/email/resend/resend.types';

export class ResendWebhookEventDataDto {
  public email_id: string;
  public from: string;
  public subject: string;
  public template_id: string;
  public to: string[];
}

export class ResendWebhookEventDto {
  @IsObject()
  public data: ResendWebhookEventDataDto;

  @IsString()
  public type: ResendWebhookEventType;
}
