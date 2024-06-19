import { IsDate, IsEnum } from 'class-validator';

import { EmailEventTypeEnum } from '@domain/emails/email.enum';

export class EmailEventEntity {
  @IsDate()
  public timestamp: Date;

  @IsEnum(EmailEventTypeEnum)
  public type: EmailEventTypeEnum;

  constructor(props: EmailEventEntity) {
    this.timestamp = props.timestamp;

    this.type = props.type;
  }
}
