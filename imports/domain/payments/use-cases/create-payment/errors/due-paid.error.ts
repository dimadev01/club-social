import { BaseErrorOld } from '@application/errors/error.base';

export class DuePaidError extends BaseErrorOld {
  constructor(id: string) {
    super(`Due ${id} is already paid`);
  }
}
