import { plainToInstance } from 'class-transformer';
import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { UseCase } from '@application/common/use-case.base';
import { IUseCase } from '@application/common/use-case.interfaces';
import { Professor } from '@domain/professors/professor.entity';
import { ProfessorsCollection } from '@domain/professors/professors.collection';
import { GetProfessorsResponseDto } from '@domain/professors/use-cases/get-professors/get-professors-response.dto';

@injectable()
export class GetProfessorsUseCase
  extends UseCase
  implements IUseCase<undefined, GetProfessorsResponseDto[]>
{
  public async execute(): Promise<Result<GetProfessorsResponseDto[], Error>> {
    const data = await ProfessorsCollection.rawCollection()
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
                  'profile.lastName': 1,
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

    return ok<GetProfessorsResponseDto[]>(
      data
        .map((professor) => plainToInstance(Professor, professor))
        .map((professor) => ({
          _id: professor._id,
          // @ts-expect-error
          name: `${professor.user.profile?.lastName} ${professor.user.profile?.firstName}`,
        }))
        .sort((a, b) => a.name.localeCompare(b.name))
    );
  }
}
