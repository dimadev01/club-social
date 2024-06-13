import { BaseError } from '@domain/common/errors/base.error';

export class DueNotPayable extends BaseError {
  constructor(id: string) {
    super(`Due ${id} is not payable`);
  }
}
