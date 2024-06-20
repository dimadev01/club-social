import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { IUnitOfWork } from '@application/common/repositories/unit-of-work';
import { IUseCase } from '@application/common/use-case.interface';
import { IEventRepository } from '@application/events/repositories/event.repository';
import { MemberDto } from '@application/members/dtos/member.dto';
import { IMemberRepository } from '@application/members/repositories/member.repository';
import { GetMemberUseCase } from '@application/members/use-cases/get-member/get-member.use.case';
import { UpdateMemberRequest } from '@application/members/use-cases/update-member/update-member.request';
import { UpdateUserUseCase } from '@application/users/use-cases/update-user-theme/update-user.use-case';
import { InternalServerError } from '@domain/common/errors/internal-server.error';
import { BirthDate } from '@domain/common/value-objects/birth-date.value-object';
import { EventActionEnum, EventResourceEnum } from '@domain/events/event.enum';
import { Event } from '@domain/events/models/event.model';
import { ExistingMemberByDocumentError } from '@domain/members/errors/existing-member-by-document.error';
import { RoleEnum } from '@domain/roles/role.enum';

@injectable()
export class UpdateMemberUseCase
  implements IUseCase<UpdateMemberRequest, MemberDto>
{
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
    @inject(DIToken.IEventRepository)
    private readonly _eventRepository: IEventRepository,
    @inject(DIToken.IUnitOfWork)
    private readonly _unitOfWork: IUnitOfWork,
    private readonly _updateUserUseCase: UpdateUserUseCase,
    private readonly _getMemberUseCase: GetMemberUseCase,
  ) {}

  public async execute(
    request: UpdateMemberRequest,
  ): Promise<Result<MemberDto, Error>> {
    const validation = await this._validate(request);

    if (validation.isErr()) {
      return err(validation.error);
    }

    try {
      this._unitOfWork.start();

      const member = await this._memberRepository.findOneByIdOrThrow({
        id: request.id,
      });

      await this._unitOfWork.withTransaction(async (unitOfWork) => {
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
          member.setBirthDate(
            request.birthDate ? new BirthDate(request.birthDate) : null,
          ),
          member.setDocumentID(request.documentID),
          member.setFileStatus(request.fileStatus),
          member.setFirstName(request.firstName),
          member.setLastName(request.lastName),
          member.setMaritalStatus(request.maritalStatus),
          member.setNationality(request.nationality),
          member.setPhones(request.phones),
          member.setSex(request.sex),
        ]);

        if (memberUpdate.isErr()) {
          throw memberUpdate.error;
        }

        await this._memberRepository.updateWithSession(member, unitOfWork);

        const event = Event.create({
          action: EventActionEnum.UPDATE,
          description: null,
          resource: EventResourceEnum.MEMBERS,
          resourceId: member._id,
        });

        if (event.isErr()) {
          throw event.error;
        }

        await this._eventRepository.insertWithSession(event.value, unitOfWork);
      });

      return await this._getMemberUseCase.execute({ id: request.id });
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
