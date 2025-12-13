import { Inject } from '@nestjs/common';

import type { Result } from '@/shared/domain/result';

import { MemberEntity } from '@/members/domain/entities/member.entity';
import {
  MEMBER_REPOSITORY_PROVIDER,
  type MemberRepository,
} from '@/members/domain/member.repository';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UseCase } from '@/shared/application/use-case';
import { ConflictError } from '@/shared/domain/errors/conflict.error';
import { DomainEventPublisher } from '@/shared/domain/events/domain-event-publisher';
import { err, ok } from '@/shared/domain/result';
import { Email } from '@/shared/domain/value-objects/email/email.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import {
  USER_REPOSITORY_PROVIDER,
  type UserRepository,
} from '@/users/domain/user.repository';

import { UpdateMemberParams } from './update-member.params';

export class UpdateMemberUseCase extends UseCase<MemberEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(MEMBER_REPOSITORY_PROVIDER)
    private readonly memberRepository: MemberRepository,
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {
    super(logger);
  }

  public async execute(
    params: UpdateMemberParams,
  ): Promise<Result<MemberEntity>> {
    this.logger.info({
      message: 'Updating member',
      params,
    });

    const email = Email.create(params.email);

    if (email.isErr()) {
      return err(email.error);
    }

    const existingUserByEmail = await this.userRepository.findUniqueByEmail(
      email.value,
    );

    const member = await this.memberRepository.findOneByIdOrThrow(
      UniqueId.raw({ value: params.id }),
    );

    if (existingUserByEmail && !existingUserByEmail.id.equals(member.userId)) {
      return err(new ConflictError('El email ya está en uso'));
    }

    member.updateProfile({
      address: params.address,
      birthDate: params.birthDate,
      category: params.category,
      documentID: params.documentID,
      email: email.value,
      fileStatus: params.fileStatus,
      firstName: params.firstName,
      lastName: params.lastName,
      maritalStatus: params.maritalStatus,
      nationality: params.nationality,
      phones: params.phones,
      sex: params.sex,
      status: params.status,
      updatedBy: params.updatedBy,
    });

    this.eventPublisher.dispatch(member);

    return ok(member);
  }
}
