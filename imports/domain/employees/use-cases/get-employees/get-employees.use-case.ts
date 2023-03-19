import { plainToInstance } from 'class-transformer';
import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { Employee } from '@domain/employees/employee.entity';
import { EmployeesCollection } from '@domain/employees/employees.collection';
import { GetEmployeesResponseDto } from '@domain/employees/use-cases/get-employees/get-employees-response.dto';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class GetEmployeesUseCase
  extends UseCase
  implements IUseCase<undefined, GetEmployeesResponseDto[]>
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
          // @ts-expect-error
          name: `${employee.user.profile?.lastName} ${employee.user.profile?.firstName}`,
        }))
    );
  }
}
