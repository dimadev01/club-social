import { DomainError } from '@domain/common/errors/domain.error';

export class DueNotPayable extends DomainError {
  constructor(id: string) {
    super(`Due ${id} is not payable`);
  }
}
