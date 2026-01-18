import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { PrismaClientLike } from '@/infrastructure/database/prisma/prisma.types';

import { EmailSuppressionRepository } from '../domain/email-suppression.repository';
import { EmailSuppressionEntity } from '../domain/entities/email-suppression.entity';
import { PrismaEmailSuppressionMapper } from './prisma-email-suppression.mapper';

@Injectable()
export class PrismaEmailSuppressionRepository implements EmailSuppressionRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly emailSuppressionMapper: PrismaEmailSuppressionMapper,
  ) {}

  public async findByEmail(
    email: string,
  ): Promise<EmailSuppressionEntity | null> {
    const suppression = await this.prismaService.emailSuppression.findUnique({
      where: { email: email.toLowerCase() },
    });

    return suppression
      ? this.emailSuppressionMapper.toDomain(suppression)
      : null;
  }

  public async isEmailSuppressed(email: string): Promise<boolean> {
    const suppression = await this.prismaService.emailSuppression.findUnique({
      where: { email: email.toLowerCase() },
    });

    return !!suppression;
  }

  public async save(
    entity: EmailSuppressionEntity,
    tx?: PrismaClientLike,
  ): Promise<void> {
    const client = tx ?? this.prismaService;

    const create = this.emailSuppressionMapper.toCreateInput(entity);

    await client.emailSuppression.upsert({
      create,
      update: {},
      where: { email: entity.email.toLowerCase() },
    });
  }
}
