import { MeteorErrorCodeEnum } from '@infra/meteor/common/meteor-errors.enum';
import { MeteorError } from '@infra/meteor/errors/meteor-error';

export class MeteorInternalServerError extends MeteorError {
  public constructor(message = 'Internal Server Error', details?: string) {
    super(MeteorErrorCodeEnum.INTERNAL_SERVER_ERROR, message, details);
  }
}
