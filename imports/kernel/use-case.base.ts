import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { ValidationError } from 'class-validator';
import { MeteorErrorCode } from '@kernel/errors.enum';

export abstract class UseCase {
  protected async validateDto<T extends object>(
    classType: ClassType<T>,
    value: T
  ): Promise<void> {
    if (!value) {
      throw new Meteor.Error(MeteorErrorCode.BadRequest, 'Request is empty');
    }

    try {
      await transformAndValidate(classType, value);
    } catch (err) {
      const errors = err as ValidationError[];

      throw new Meteor.Error(
        MeteorErrorCode.BadRequest,
        JSON.stringify(
          errors.map((error) => ({
            errors: error.constraints
              ? Object.values(error.constraints).map((constraint) => constraint)
              : [],
            property: error.property,
            value: error.value,
          }))
        )
      );
    }
  }
}
