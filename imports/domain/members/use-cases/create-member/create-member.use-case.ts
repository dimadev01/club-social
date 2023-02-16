import { err, ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { Member } from '@domain/members/member.entity';
import { MembersCollection } from '@domain/members/members.collection';
import { CreateMemberRequestDto } from '@domain/members/use-cases/create-member/create-member-request.dto';
import { CreateUserUseCase } from '@domain/users/use-cases/create-user/create-user.use-case';
import { Logger } from '@infra/logger/logger.service';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class CreateMemberUseCase
  extends UseCase<CreateMemberRequestDto>
  implements IUseCase<CreateMemberRequestDto, string>
{
  public constructor(
    private readonly _createUserUseCase: CreateUserUseCase,
    private readonly _logger: Logger
  ) {
    super();
  }

  public async execute(
    request: CreateMemberRequestDto
  ): Promise<Result<string, Error>> {
    await this.validateDto(CreateMemberRequestDto, request);

    const createUserResult = await this._createUserUseCase.execute({
      emails: request.emails,
      firstName: request.firstName,
      lastName: request.lastName,
      role: request.role,
    });

    if (createUserResult.isErr()) {
      return err(createUserResult.error);
    }

    const member = Member.create({
      dateOfBirth: request.dateOfBirth,
      userId: createUserResult.value,
    });

    if (member.isErr()) {
      return err(member.error);
    }

    const memberId = await MembersCollection.insertAsync(member.value);

    this._logger.info('Member created', { memberId: member.value });

    return ok(memberId);
  }
}
