import { Result, err } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { IUnitOfWork } from '@application/common/repositories/unit-of-work';
import { IUseCase } from '@application/common/use-case.interface';
import { MemberDto } from '@application/members/dtos/member.dto';
import { IMemberRepository } from '@application/members/repositories/member.repository';
import { CreateMemberRequest } from '@application/members/use-cases/create-member/create-member.request';
import { GetMemberUseCase } from '@application/members/use-cases/get-member/get-member.use.case';
import { CreateUserUseCase } from '@application/users/use-cases/create-user/create-user.use-case';
import { InternalServerError } from '@domain/common/errors/internal-server.error';
import { BirthDate } from '@domain/common/value-objects/birth-date.value-object';
import { ExistingMemberByDocumentError } from '@domain/members/errors/existing-member-by-document.error';
import { Member } from '@domain/members/models/member.model';
import { RoleEnum } from '@domain/roles/role.enum';

@injectable()
export class CreateMemberUseCase
  implements IUseCase<CreateMemberRequest, MemberDto>
{
  public constructor(
    @inject(DIToken.IUnitOfWork)
    private readonly _unitOfWork: IUnitOfWork,
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
    private readonly _getMemberUseCase: GetMemberUseCase,
    private readonly _createUserUseCase: CreateUserUseCase,
  ) {}

  public async execute(
    request: CreateMemberRequest,
  ): Promise<Result<MemberDto, Error>> {
    if (request.documentID) {
      const existingMemberByDocument =
        await this._memberRepository.findByDocument(request.documentID);

      if (existingMemberByDocument) {
        return err(new ExistingMemberByDocumentError(request.documentID));
      }
    }

    try {
      this._unitOfWork.start();

      let newMemberId: string | undefined;

      await this._unitOfWork.withTransaction(async (unitOfWork) => {
        const userResult = await this._createUserUseCase.execute({
          emails: request.emails?.map((email) => email) ?? null,
          firstName: request.firstName,
          lastName: request.lastName,
          role: RoleEnum.MEMBER,
          unitOfWork,
        });

        if (userResult.isErr()) {
          throw userResult.error;
        }

        const member = Member.create({
          address: {
            cityGovId: request.addressCityGovId,
            cityName: request.addressCityName,
            stateGovId: request.addressStateGovId,
            stateName: request.addressStateName,
            street: request.addressStreet,
            zipCode: request.addressZipCode,
          },
          birthDate: request.birthDate
            ? new BirthDate(request.birthDate)
            : null,
          category: request.category,
          documentID: request.documentID,
          fileStatus: request.fileStatus,
          firstName: userResult.value.firstName,
          lastName: userResult.value.lastName,
          maritalStatus: request.maritalStatus,
          nationality: request.nationality,
          phones: request.phones,
          sex: request.sex,
          userId: userResult.value._id,
        });

        if (member.isErr()) {
          throw member.error;
        }

        await this._memberRepository.insertWithSession(
          member.value,
          unitOfWork,
        );

        newMemberId = member.value._id;
      });

      invariant(newMemberId);

      return await this._getMemberUseCase.execute({ id: newMemberId });
    } catch (error) {
      if (error instanceof Error) {
        return err(error);
      }

      throw new InternalServerError();
    } finally {
      await this._unitOfWork.end();
    }
  }
}
