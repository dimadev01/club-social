import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Webhook } from 'svix';

import { ConfigService } from '@/infrastructure/config/config.service';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';

import { HandleDeliveryWebhookUseCase } from '../application/handle-delivery-webhook.use-case';
import { ResendWebhookDto } from './dto/resend-webhook.dto';

@ApiExcludeController()
@Controller('webhooks')
export class WebhookController {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    private readonly configService: ConfigService,
    private readonly handleDeliveryWebhookUseCase: HandleDeliveryWebhookUseCase,
  ) {
    this.logger.setContext(WebhookController.name);
  }

  @HttpCode(HttpStatus.OK)
  @Post('resend')
  public async handleResendWebhook(
    @Req() req: { rawBody?: Buffer },
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
    @Body() body: ResendWebhookDto,
  ): Promise<{ success: boolean }> {
    this.logger.info({
      message: 'Received Resend webhook',
      type: body.type,
    });

    const webhookSecret = this.configService.resendWebhookSecret;

    if (webhookSecret) {
      const rawBody = req.rawBody;

      if (!rawBody) {
        this.logger.error({
          error: new Error('Missing raw body'),
          message: 'Missing raw body for webhook verification',
        });
        throw new UnauthorizedException('Invalid webhook signature');
      }

      try {
        const webhook = new Webhook(webhookSecret);

        webhook.verify(rawBody.toString(), {
          'svix-id': svixId,
          'svix-signature': svixSignature,
          'svix-timestamp': svixTimestamp,
        });
      } catch (error) {
        this.logger.error({
          error,
          message: 'Invalid webhook signature',
        });

        throw new UnauthorizedException('Invalid webhook signature');
      }
    } else {
      this.logger.warn({
        message:
          'Webhook signature verification skipped - no secret configured',
      });
    }

    const result = await this.handleDeliveryWebhookUseCase.execute({
      data: body.data,
      type: body.type,
    });

    if (result.isErr()) {
      this.logger.error({
        error: result.error,
        message: 'Failed to handle webhook',
      });
    }

    return { success: true };
  }
}
