import { toLower } from 'lodash';
import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { CreateMemberRequestDto } from '@domain/members/use-cases/create-member/create-member-request.dto';
import { Logger } from '@infra/logger/logger.service';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class CreateMemberUseCase
  extends UseCase<CreateMemberRequestDto>
  implements IUseCase<CreateMemberRequestDto, string>
{
  public constructor(private readonly _logger: Logger) {
    super();
  }

  public async execute(
    request: CreateMemberRequestDto
  ): Promise<Result<string, Error>> {
    await this.validateDto(CreateMemberRequestDto, request);

    // @ts-ignore
    const memberId = await Accounts.createMemberVerifyingEmail({
      email: toLower(request.email),
      profile: {
        firstName: request.firstName,
        lastName: request.lastName,
        role: request.role,
      },
    });

    this._logger.info('Member created', { memberId });

    return ok(memberId);
  }
}
