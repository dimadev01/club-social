import { plainToInstance } from 'class-transformer';
import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { Rental } from '@domain/rentals/rental.entity';
import { RentalsCollection } from '@domain/rentals/rentals.collection';
import { GetRentalsResponseDto } from '@domain/rentals/use-cases/get-rentals/get-rentals-response.dto';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class GetRentalsUseCase
  extends UseCase
  implements IUseCase<undefined, GetRentalsResponseDto[]>
{
  public async execute(): Promise<Result<GetRentalsResponseDto[], Error>> {
    const data = await RentalsCollection.find(
      {},
      { sort: { name: 1 } }
    ).fetchAsync();

    return ok<GetRentalsResponseDto[]>(
      data
        .map((rental) => plainToInstance(Rental, rental))
        .map((rental) => ({
          _id: rental._id,
          name: rental.name,
        }))
    );
  }
}
