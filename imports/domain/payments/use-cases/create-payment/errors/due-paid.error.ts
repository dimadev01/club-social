import { BaseError } from '@application/errors/error.base';

export class DuePaidError extends BaseError {
  constructor(id: string) {
    super(`Due ${id} is already paid`);
  }
}
