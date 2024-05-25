import { plainToInstance } from 'class-transformer';
import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { ProfessorsCollection } from '@domain/professors/professor.collection';
import { Professor } from '@domain/professors/professor.entity';
import { GetProfessorsResponseDto } from '@domain/professors/use-cases/get-professors/get-professors-response.dto';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class GetProfessorsUseCase
  extends UseCase
  implements IUseCase<null, GetProfessorsResponseDto[]>
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
        .sort((a, b) => a.name.localeCompare(b.name)),
    );
  }
}
