import type { InputJsonValue } from '@prisma/client/runtime/client';

import { EmailSuppressionReason } from '@club-social/shared/notifications';
import { Injectable } from '@nestjs/common';

import {
  EmailSuppressionCreateInput,
  EmailSuppressionModel,
} from '@/infrastructure/database/prisma/generated/models';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { EmailSuppressionEntity } from '../domain/entities/email-suppression.entity';

@Injectable()
export class PrismaEmailSuppressionMapper {
  public toCreateInput(
    suppression: EmailSuppressionEntity,
  ): EmailSuppressionCreateInput {
    return {
      createdBy: suppression.createdBy,
      email: suppression.email,
      id: suppression.id.value,
      providerData:
        (suppression.providerData as unknown as InputJsonValue) ?? null,
      providerEventId: suppression.providerEventId,
      reason: suppression.reason,
    };
  }

  public toDomain(suppression: EmailSuppressionModel): EmailSuppressionEntity {
    return EmailSuppressionEntity.fromPersistence(
      {
        createdBy: suppression.createdBy,
        email: suppression.email,
        providerData: suppression.providerData as null | Record<
          string,
          unknown
        >,
        providerEventId: suppression.providerEventId,
        reason: suppression.reason as EmailSuppressionReason,
      },
      {
        createdAt: suppression.createdAt,
        id: UniqueId.raw({ value: suppression.id }),
      },
    );
  }
}
