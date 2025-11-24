import { ApplicationError } from './application.error';

export class EntityNotFoundError extends ApplicationError {
  public constructor(entity: { name: string }, id: string) {
    super(`${entity.name} with id ${id} not found`);
  }
}
