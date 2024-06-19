import { singleton } from 'tsyringe';

import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
import { EmailVo } from '@domain/common/value-objects/email.value-object';
import { EmailTo } from '@domain/emails/models/email-to.model';
import { Email } from '@domain/emails/models/email.model';
import { Mapper } from '@infra/mongo/common/mappers/mapper';
import { EmailEntity } from '@infra/mongo/entities/email.entity';

@singleton()
export class EmailMapper extends Mapper<Email, EmailEntity> {
  public toDomain(entity: EmailEntity): Email {
    return new Email({
      _id: entity._id,
      createdAt: new DateTimeVo(entity.createdAt),
      createdBy: entity.createdBy,
      deletedAt: entity.deletedAt ? new DateTimeVo(entity.deletedAt) : null,
      deletedBy: entity.deletedBy,
      deliveredAt: entity.deliveredAt,
      events: entity.events,
      from: new EmailTo({
        email: EmailVo.from(entity.from.email),
        name: entity.from.name,
      }),
      isDeleted: entity.isDeleted,
      sentAt: entity.sentAt,
      status: entity.status,
      templateId: entity.templateId,
      to: new EmailTo({
        email: EmailVo.from(entity.to.email),
        name: entity.to.name,
      }),
      updatedAt: new DateTimeVo(entity.updatedAt),
      updatedBy: entity.updatedBy,
    });
  }

  protected getEntity(domain: Email): EmailEntity {
    return new EmailEntity({
      _id: domain._id,
      createdAt: domain.createdAt.date,
      createdBy: domain.createdBy,
      deletedAt: domain.deletedAt?.date ?? null,
      deletedBy: domain.deletedBy,
      deliveredAt: domain.deliveredAt,
      events: domain.events,
      from: {
        email: domain.from.email.address,
        name: domain.from.name,
      },
      isDeleted: domain.isDeleted,
      sentAt: domain.sentAt,
      status: domain.status,
      templateId: domain.templateId,
      to: {
        email: domain.to.email.address,
        name: domain.to.name,
      },
      updatedAt: domain.updatedAt.date,
      updatedBy: domain.updatedBy,
    });
  }
}
