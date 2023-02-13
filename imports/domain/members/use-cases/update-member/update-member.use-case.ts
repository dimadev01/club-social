import { err, ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { MembersCollection } from '@domain/members/members.collection';
import { UpdateMemberRequestDto } from '@domain/members/use-cases/update-member/update-member-request.dto';
import { Logger } from '@infra/logger/logger.service';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class UpdateMemberUseCase
  extends UseCase<UpdateMemberRequestDto>
  implements IUseCase<UpdateMemberRequestDto, undefined>
{
  public constructor(private readonly _logger: Logger) {
    super();
  }

  public async execute(
    request: UpdateMemberRequestDto
  ): Promise<Result<undefined, Error>> {
    await this.validateDto(UpdateMemberRequestDto, request);

    const member = await MembersCollection.findOneAsync(request.id);

    if (!member) {
      return err(new Error('Member not found'));
    }

    await MembersCollection.updateAsync(request.id, {
      $set: {
        'profile.firstName': request.firstName,
        'profile.lastName': request.lastName,
      },
    });

    this._logger.info('Member updated', { memberId: request.id });

    return ok(undefined);
  }
}
