import { MeteorErrorCodeEnum } from '@infra/meteor/common/meteor-errors.enum';
import { MeteorError } from '@infra/meteor/errors/meteor-error';

export class MeteorBadRequestError extends MeteorError {
  public constructor(message: string, details?: string) {
    super(MeteorErrorCodeEnum.BAD_REQUEST, message, details);
  }
}
