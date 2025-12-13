import { UserRole, UserStatus } from '@club-social/shared/users';
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
import { UserEntity } from '@/users/domain/entities/user.entity';
import {
  USER_REPOSITORY_PROVIDER,
  type UserRepository,
} from '@/users/domain/user.repository';

import type { CreateMemberParams } from './create-member.params';

export class CreateMemberUseCase extends UseCase<MemberEntity> {
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
    params: CreateMemberParams,
  ): Promise<Result<MemberEntity>> {
    this.logger.info({
      message: 'Creating member',
      params,
    });

    const email = Email.create(params.email);

    if (email.isErr()) {
      return err(email.error);
    }

    const existingUserByEmail = await this.userRepository.findUniqueByEmail(
      email.value,
    );

    if (existingUserByEmail) {
      return err(new ConflictError('El email ya está en uso'));
    }

    const user = UserEntity.create({
      banExpires: null,
      banned: false,
      banReason: null,
      createdBy: params.createdBy,
      email: email.value,
      firstName: params.firstName,
      lastName: params.lastName,
      role: UserRole.MEMBER,
      status: UserStatus.ACTIVE,
    });

    if (user.isErr()) {
      return err(user.error);
    }

    const member = MemberEntity.create({
      address: params.address,
      birthDate: params.birthDate,
      category: params.category,
      createdBy: params.createdBy,
      documentID: params.documentID,
      fileStatus: params.fileStatus,
      maritalStatus: params.maritalStatus,
      nationality: params.nationality,
      phones: params.phones,
      sex: params.sex,
      userId: user.value.id,
    });

    if (member.isErr()) {
      return err(member.error);
    }

    await this.memberRepository.save(member.value);
    this.eventPublisher.dispatch(member.value);

    return ok(member.value);
  }
}
