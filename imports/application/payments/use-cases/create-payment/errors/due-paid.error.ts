import { BaseError } from '@domain/common/errors/base.error';

export class DuePaidError extends BaseError {
  constructor(id: string) {
    super(`Due ${id} is already paid`);
  }
}
