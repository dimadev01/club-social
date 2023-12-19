import { BaseError } from '@application/errors/error.base';

export class DueCanceledError extends BaseError {
  constructor(id: string) {
    super(`Due ${id} is canceled`);
  }
}
