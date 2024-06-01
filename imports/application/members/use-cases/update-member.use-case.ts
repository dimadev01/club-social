import { Result, err, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { MemberModelDto } from '@application/members/dtos/member-model.dto';
import { GetMemberUseCase } from '@application/members/use-cases/get-member.use.case';
import { UpdateUserUseCase } from '@application/users/use-cases/update-user.use-case';
import { InternalServerError } from '@domain/common/errors/internal-server.error';
import { IUnitOfWork } from '@domain/common/repositories/unit-of-work';
import { DIToken } from '@domain/common/tokens.di';
import { IUseCase } from '@domain/common/use-case.interface';
import { ExistingMemberByDocumentError } from '@domain/members/errors/existing-member-by-document.error';
import { UpdateMemberRequest } from '@domain/members/member.types';
import { IMemberRepository } from '@domain/members/repositories/member.repository';
import { RoleEnum } from '@domain/roles/role.enum';

@injectable()
export class UpdateMemberUseCase<TSession>
  implements IUseCase<UpdateMemberRequest, MemberModelDto>
{
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository<TSession>,
    @inject(DIToken.IUnitOfWork)
    private readonly _unitOfWork: IUnitOfWork<TSession>,
    private readonly _updateUserUseCase: UpdateUserUseCase<TSession>,
    private readonly _getMemberUseCase: GetMemberUseCase,
  ) {}

  public async execute(
    request: UpdateMemberRequest,
  ): Promise<Result<MemberModelDto, Error>> {
    const validation = await this._validate(request);

    if (validation.isErr()) {
      return err(validation.error);
    }

    try {
      this._unitOfWork.start();

      await this._unitOfWork.withTransaction(async (session) => {
        const member = await this._memberRepository.findOneByIdOrThrow({
          id: request.id,
        });

        const userResult = await this._updateUserUseCase.execute({
          emails: request.emails?.map((email) => email) ?? null,
          firstName: request.firstName,
          id: member.userId,
          lastName: request.lastName,
          role: RoleEnum.MEMBER,
          unitOfWork: this._unitOfWork,
        });

        if (userResult.isErr()) {
          throw userResult.error;
        }

        const memberUpdate = Result.combine([
          member.address.setCityGovId(request.addressCityGovId),
          member.address.setCityName(request.addressCityName),
          member.address.setStateGovId(request.addressStateGovId),
          member.address.setStateName(request.addressStateName),
          member.address.setStreet(request.addressStreet),
          member.address.setZipCode(request.addressZipCode),
          member.setCategory(request.category),
          member.setStatus(request.status),
          member.setDateOfBirth(request.birthDate),
          member.setDocumentID(request.documentID),
          member.setFileStatus(request.fileStatus),
          member.setMaritalStatus(request.maritalStatus),
          member.setNationality(request.nationality),
          member.setPhones(request.phones),
          member.setSex(request.sex),
        ]);

        if (memberUpdate.isErr()) {
          throw memberUpdate.error;
        }

        await this._memberRepository.updateWithSession(member, session);
      });

      const member = await this._getMemberUseCase.execute({ id: request.id });

      if (member.isErr()) {
        return err(member.error);
      }

      invariant(member.value);

      return ok(member.value);
    } catch (error) {
      if (error instanceof Error) {
        return err(error);
      }

      throw new InternalServerError();
    } finally {
      await this._unitOfWork.end();
    }
  }

  private async _validate(
    request: UpdateMemberRequest,
  ): Promise<Result<null, Error>> {
    if (request.documentID) {
      const existingMemberByDocument =
        await this._memberRepository.findByDocument(request.documentID);

      if (
        existingMemberByDocument &&
        existingMemberByDocument._id !== request.id
      ) {
        return err(new ExistingMemberByDocumentError(request.documentID));
      }
    }

    return ok(null);
  }
}
