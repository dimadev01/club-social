import type { Request } from 'express';

import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Inject,
  Post,
  type RawBodyRequest,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

import { ResendProvider } from '@/infrastructure/email/resend/resend.provider';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { BaseController } from '@/shared/presentation/controller';
import { PublicRoute } from '@/shared/presentation/decorators/public-route.decorator';

import { HandleDeliveryWebhookUseCase } from '../application/handle-delivery-webhook.use-case';
import { ResendWebhookEventDto } from './dto/resend-webhook.dto';

@ApiExcludeController()
@Controller('webhooks')
export class WebhookController extends BaseController {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    private readonly handleDeliveryWebhookUseCase: HandleDeliveryWebhookUseCase,
    private readonly resendProvider: ResendProvider,
  ) {
    super(logger);
  }

  @HttpCode(200)
  @Post('resend')
  @PublicRoute()
  public async handleResendWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
    @Body() body: ResendWebhookEventDto,
  ): Promise<void> {
    this.logger.info({
      message: 'Received Resend webhook',
      type: body.type,
    });

    const rawBody = req.rawBody;

    if (!rawBody) {
      this.logger.error({
        error: new Error('Missing raw body'),
        message: 'Missing raw body for webhook verification',
      });
      throw new UnauthorizedException('Invalid webhook signature');
    }

    const isWebhookValid = this.resendProvider.verifyWebhook({
      id: svixId,
      payload: rawBody.toString(),
      signature: svixSignature,
      timestamp: svixTimestamp,
    });

    if (!isWebhookValid) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    this.handleResult(
      await this.handleDeliveryWebhookUseCase.execute({
        data: {
          providerId: body.data.email_id,
          to: body.data.to,
        },
        type: body.type,
      }),
    );
  }
}
