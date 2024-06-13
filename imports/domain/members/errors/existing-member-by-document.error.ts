import { DomainError } from '@domain/common/errors/base.error';

export class ExistingMemberByDocumentError extends DomainError {
  constructor(documentID: string) {
    super(`Socio con documento ${documentID} ya existe.`);
  }
}
