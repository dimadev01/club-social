import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { EventActionEnum, EventResourceEnum } from '@domain/events/event.enum';
import { Entity } from '@infra/mongo/common/entities/entity';
import { IsNullable } from '@ui/common/class-validator/is-nullable';

export class EventEntity extends Entity {
  @IsNotEmpty()
  @IsString()
  @IsNullable()
  @IsDefined()
  public description: string | null;

  @IsEnum(EventResourceEnum)
  public resource: EventResourceEnum;

  @IsEnum(EventActionEnum)
  public action: EventActionEnum;

  @IsNotEmpty()
  @IsString()
  public resourceId: string;

  public constructor(props: EventEntity) {
    super(props);

    this.description = props.description;

    this.resource = props.resource;

    this.resourceId = props.resourceId;

    this.action = props.action;
  }
}
