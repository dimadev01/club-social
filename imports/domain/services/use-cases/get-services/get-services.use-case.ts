import { plainToInstance } from 'class-transformer';
import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { Service } from '@domain/services/service.entity';
import { ServicesCollection } from '@domain/services/services.collection';
import { GetServicesResponseDto } from '@domain/services/use-cases/get-services/get-services-response.dto';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class GetServicesUseCase
  extends UseCase
  implements IUseCase<undefined, GetServicesResponseDto[]>
{
  public async execute(): Promise<Result<GetServicesResponseDto[], Error>> {
    const data = await ServicesCollection.find(
      {},
      { sort: { name: 1 } }
    ).fetchAsync();

    return ok<GetServicesResponseDto[]>(
      data
        .map((service) => plainToInstance(Service, service))
        .map((service) => ({
          _id: service._id,
          name: service.name,
        }))
    );
  }
}
