import { ValidationError } from 'class-validator';

export abstract class ValidationUtils {
  static getError(errors: ValidationError[]): Error {
    return new Error(this.getErrorMessage(errors));
  }

  static getErrorMessage(errors: ValidationError[]): string {
    return JSON.stringify(
      errors.map((error) => ({
        errors: error.constraints
          ? Object.values(error.constraints).map((constraint) => constraint)
          : [],
        property: error.property,
        value: error.value,
      }))
    );
  }
}
