import {
  IsDate,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

import {
  NotificationResourceEnum,
  NotificationStatusEnum,
} from '@domain/notifications/notification.enum';
import { Entity } from '@infra/mongo/common/entities/entity';
import { IsNullable } from '@ui/common/class-validator/is-nullable';

export class NotificationEntity extends Entity {
  @IsNotEmpty()
  @IsString()
  public message: string;

  @IsDate()
  @IsNullable()
  @IsDefined()
  public readAt: Date | null;

  @IsNotEmpty()
  @IsString()
  public receiverId: string;

  @IsNotEmpty()
  @IsString()
  public receiverName: string;

  @IsEnum(NotificationResourceEnum)
  public resource: NotificationResourceEnum;

  @IsNotEmpty()
  @IsString()
  public resourceId: string;

  @IsEnum(NotificationStatusEnum)
  public status: NotificationStatusEnum;

  @IsNotEmpty()
  @IsString()
  public subject: string;

  public constructor(props: NotificationEntity) {
    super(props);

    this.message = props.message;

    this.readAt = props.readAt;

    this.receiverId = props.receiverId;

    this.receiverName = props.receiverName;

    this.resource = props.resource;

    this.resourceId = props.resourceId;

    this.status = props.status;

    this.subject = props.subject;
  }
}
