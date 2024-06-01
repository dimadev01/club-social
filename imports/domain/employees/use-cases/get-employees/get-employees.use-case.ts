import { plainToInstance } from 'class-transformer';
import { Result, ok } from 'neverthrow';
import { injectable } from 'tsyringe';

import { EmployeesCollection } from '@adapters/mongo/collections/employee.collection';
import { IUseCaseOld } from '@application/use-cases/use-case.interface';
import { Employee } from '@domain/employees/employee.entity';
import { GetEmployeesResponseDto } from '@domain/employees/use-cases/get-employees/get-employees-response.dto';
import { UseCaseOld } from '@infra/use-cases/use-case';

@injectable()
export class GetEmployeesUseCase
  extends UseCaseOld
  implements IUseCaseOld<null, GetEmployeesResponseDto[]>
{
  public async execute(): Promise<Result<GetEmployeesResponseDto[], Error>> {
    const data = await EmployeesCollection.rawCollection()
      .aggregate([
        {
          $lookup: {
            as: 'user',
            foreignField: '_id',
            from: 'users',
            localField: 'userId',
            pipeline: [
              {
                $sort: {
                  'profile.lastname': 1,
                },
              },
            ],
          },
        },
        {
          $unwind: '$user',
        },
      ])
      .toArray();

    return ok<GetEmployeesResponseDto[]>(
      data
        .map((employee) => plainToInstance(Employee, employee))
        .map((employee) => ({
          _id: employee._id,
          name: `${employee.user.profile?.lastName} ${employee.user.profile?.firstName}`,
        })),
    );
  }
}
