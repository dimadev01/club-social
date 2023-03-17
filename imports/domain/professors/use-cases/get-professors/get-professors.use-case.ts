import { plainToInstance } from 'class-transformer';
import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { Professor } from '@domain/professors/professor.entity';
import { ProfessorsCollection } from '@domain/professors/professors.collection';
import { GetProfessorsResponseDto } from '@domain/professors/use-cases/get-professors/get-professors-response.dto';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

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
          name: `${professor.user.profile?.firstName} ${professor.user.profile?.lastName}`,
        }))
        .sort((a, b) => a.name.localeCompare(b.name))
    );
  }
}
