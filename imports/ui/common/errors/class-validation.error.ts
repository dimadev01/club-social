import { ValidationError } from 'class-validator';

export class ClassValidationError extends Error {
  public errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super('Class validation error');

    this.errors = errors;

    this.name = 'ClassValidationError';
  }
}
