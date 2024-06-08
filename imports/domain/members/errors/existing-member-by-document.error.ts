import { BaseError } from '@domain/common/errors/base.error';

export class ExistingMemberByDocumentError extends BaseError {
  constructor(documentID: string) {
    super(`Socio con documento ${documentID} ya existe.`);
  }
}
