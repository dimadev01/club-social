import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

import { EmailStatusEnum } from '@domain/emails/email.enum';
import { Entity } from '@infra/mongo/common/entities/entity';
import { EmailEventEntity } from '@infra/mongo/entities/email-event.entity';
import { EmailToEntity } from '@infra/mongo/entities/email-to.entity';
import { IsNullable } from '@ui/common/class-validator/is-nullable';

export class EmailEntity extends Entity {
  @IsDate()
  @IsNullable()
  @IsDefined()
  public deliveredAt: Date | null;

  @ValidateNested({ each: true })
  @Type(() => EmailEventEntity)
  @IsArray()
  public events: EmailEventEntity[];

  @ValidateNested()
  @Type(() => EmailToEntity)
  @IsObject()
  public from: EmailToEntity;

  @IsDate()
  @IsNullable()
  @IsDefined()
  public sentAt: Date | null;

  @IsEnum(EmailStatusEnum)
  public status: EmailStatusEnum;

  @IsString()
  @IsNullable()
  @IsDefined()
  public templateId: string | null;

  @ValidateNested()
  @Type(() => EmailToEntity)
  @IsObject()
  public to: EmailToEntity;

  @IsNotEmpty()
  @IsString()
  @IsNullable()
  @IsDefined()
  public unsubscribeGroupID: string | null;

  @IsObject()
  @IsNullable()
  @IsDefined()
  public variables: Record<string, unknown> | null;

  public constructor(props: EmailEntity) {
    super(props);

    this.deliveredAt = props.deliveredAt;

    this.events = props.events;

    this.from = props.from;

    this.sentAt = props.sentAt;

    this.status = props.status;

    this.templateId = props.templateId;

    this.unsubscribeGroupID = props.unsubscribeGroupID;

    this.variables = props.variables;

    this.to = props.to;
  }
}
