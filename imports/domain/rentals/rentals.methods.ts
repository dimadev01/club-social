import { injectable } from 'tsyringe';
import { GetRentalsUseCase } from '@domain/rentals/use-cases/get-rentals/get-rentals.use-case';
import { BaseMethod } from '@infra/methods/methods.base';
import { MethodsEnum } from '@infra/methods/methods.enum';

@injectable()
export class RentalsMethods extends BaseMethod {
  public constructor(private readonly _getRentals: GetRentalsUseCase) {
    super();
  }

  public register() {
    Meteor.methods({
      [MethodsEnum.RentalsGetAll]: () => this.execute(this._getRentals),
    });
  }
}
