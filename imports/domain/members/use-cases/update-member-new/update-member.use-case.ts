import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { InternalServerError } from '@application/errors/internal-server.error';
import { IUnitOfWork } from '@domain/common/repositories/unit-of-work.interface';
import { DIToken } from '@domain/common/tokens.di';
import { IUseCaseNewV } from '@domain/common/use-case.interface';
import { ExistingMemberByDocumentError } from '@domain/members/errors/existing-member-by-document.error';
import { MemberNotFoundError } from '@domain/members/errors/member-not-found.error';
import { IMemberRepository } from '@domain/members/member-repository.interface';
import { UpdateMemberRequest } from '@domain/members/use-cases/update-member-new/update-member.request';
import { RoleEnum } from '@domain/roles/role.enum';
import { UpdateUserNewUseCase } from '@domain/users/use-cases/update-user/update-user.use-case';

@injectable()
export class UpdateMemberNewUseCase<TSession>
  implements IUseCaseNewV<UpdateMemberRequest, null>
{
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository<TSession>,
    @inject(DIToken.IUnitOfWork)
    private readonly _unitOfWork: IUnitOfWork<TSession>,
    @inject(UpdateUserNewUseCase)
    private readonly _updateUserUseCase: UpdateUserNewUseCase<TSession>,
  ) {}

  public async execute(
    request: UpdateMemberRequest,
  ): Promise<Result<null, Error>> {
    const validation = await this._validate(request);

    if (validation.isErr()) {
      return err(validation.error);
    }

    try {
      this._unitOfWork.start();

      await this._unitOfWork.withTransaction(async (session) => {
        const member = await this._memberRepository.findOneById(request.id);

        if (!member) {
          throw new MemberNotFoundError();
        }

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
          member.setDateOfBirth(request.dateOfBirth),
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

      return ok(null);
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
