import { injectable } from 'tsyringe';

import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
import { EmailVo } from '@domain/common/value-objects/email.value-object';
import { IEmailEvent } from '@domain/emails/email.interface';
import { EmailTo } from '@domain/emails/models/email-to.model';
import { Email } from '@domain/emails/models/email.model';
import { Mapper } from '@infra/mongo/common/mappers/mapper';
import { EmailEventEntity } from '@infra/mongo/entities/email-event.entity';
import { EmailEntity } from '@infra/mongo/entities/email.entity';

@injectable()
export class EmailMapper extends Mapper<Email, EmailEntity> {
  public toDomain(entity: EmailEntity): Email {
    return new Email({
      _id: entity._id,
      createdAt: new DateTimeVo(entity.createdAt),
      createdBy: entity.createdBy,
      deletedAt: entity.deletedAt ? new DateTimeVo(entity.deletedAt) : null,
      deletedBy: entity.deletedBy,
      deliveredAt: entity.deliveredAt,
      events: entity.events.map<IEmailEvent>((event) => ({
        timestamp: new DateTimeVo(event.timestamp),
        type: event.type,
      })),
      from: new EmailTo({
        email: EmailVo.from({ address: entity.from.email }),
        name: entity.from.name,
      }),
      isDeleted: entity.isDeleted,
      sentAt: entity.sentAt,
      status: entity.status,
      templateId: entity.templateId,
      to: new EmailTo({
        email: EmailVo.from({ address: entity.to.email }),
        name: entity.to.name,
      }),
      unsubscribeGroupID: entity.unsubscribeGroupID,
      updatedAt: new DateTimeVo(entity.updatedAt),
      updatedBy: entity.updatedBy,
      variables: entity.variables,
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
      events: domain.events.map<EmailEventEntity>((event) => ({
        timestamp: event.timestamp.date,
        type: event.type,
      })),
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
      unsubscribeGroupID: domain.unsubscribeGroupID,
      updatedAt: domain.updatedAt.date,
      updatedBy: domain.updatedBy,
      variables: domain.variables,
    });
  }
}
