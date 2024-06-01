import { plainToInstance } from 'class-transformer';
import { Result, ok } from 'neverthrow';
import { injectable } from 'tsyringe';

import { IUseCaseOld } from '@application/use-cases/use-case.interface';
import { ServicesCollection } from '@domain/services/service.collection';
import { Service } from '@domain/services/service.entity';
import { GetServicesResponseDto } from '@domain/services/use-cases/get-services/get-services-response.dto';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class GetServicesUseCase
  extends UseCase
  implements IUseCaseOld<null, GetServicesResponseDto[]>
{
  public async execute(): Promise<Result<GetServicesResponseDto[], Error>> {
    const data = await ServicesCollection.find(
      {},
      { sort: { name: 1 } },
    ).fetchAsync();

    return ok<GetServicesResponseDto[]>(
      data
        .map((service) => plainToInstance(Service, service))
        .map((service) => ({
          _id: service._id,
          name: service.name,
        })),
    );
  }
}
