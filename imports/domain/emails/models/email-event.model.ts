import { Result, err, ok } from 'neverthrow';

import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
import { EmailEventTypeEnum } from '@domain/emails/email.enum';
import { IEmailEvent } from '@domain/emails/email.interface';

export class EmailEvent implements IEmailEvent {
  private _timestamp: DateTimeVo;

  private _type: EmailEventTypeEnum;

  public constructor(props?: IEmailEvent) {
    this._timestamp = props?.timestamp ?? new DateTimeVo();

    this._type = props?.type ?? EmailEventTypeEnum.OPEN;
  }

  public get timestamp(): DateTimeVo {
    return this._timestamp;
  }

  public get type(): EmailEventTypeEnum {
    return this._type;
  }

  public static create(props: IEmailEvent): Result<EmailEvent, Error> {
    const emailEvent = new EmailEvent();

    const result = Result.combine([
      emailEvent.setTimeStamp(props.timestamp),
      emailEvent.setType(props.type),
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(emailEvent);
  }

  public setTimeStamp(value: DateTimeVo): Result<null, Error> {
    this._timestamp = value;

    return ok(null);
  }

  public setType(type: EmailEventTypeEnum): Result<null, Error> {
    this._type = type;

    return ok(null);
  }
}
