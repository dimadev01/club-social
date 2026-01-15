import { Inject, Injectable } from '@nestjs/common';

import {
  MEMBER_REPOSITORY_PROVIDER,
  type MemberRepository,
} from '@/members/domain/member.repository';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UseCase } from '@/shared/application/use-case';
import { ApplicationError } from '@/shared/domain/errors/application.error';
import { DomainEventPublisher } from '@/shared/domain/events/domain-event-publisher';
import { Guard } from '@/shared/domain/guards';
import { err, ok, Result } from '@/shared/domain/result';
import {
  UNIT_OF_WORK_PROVIDER,
  type UnitOfWork,
} from '@/shared/domain/unit-of-work';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { GroupEntity } from '../domain/entities/group.entity';
import {
  GROUP_REPOSITORY_PROVIDER,
  type GroupRepository,
} from '../domain/group.repository';

interface CreateGroupParams {
  createdBy: string;
  memberIds: string[];
  name: string;
}

@Injectable()
export class CreateGroupUseCase extends UseCase<GroupEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    private readonly eventPublisher: DomainEventPublisher,
    @Inject(GROUP_REPOSITORY_PROVIDER)
    private readonly groupRepository: GroupRepository,
    @Inject(MEMBER_REPOSITORY_PROVIDER)
    private readonly memberRepository: MemberRepository,
    @Inject(UNIT_OF_WORK_PROVIDER)
    private readonly unitOfWork: UnitOfWork,
  ) {
    super(logger);
  }

  public async execute(
    params: CreateGroupParams,
  ): Promise<Result<GroupEntity>> {
    this.logger.info({
      message: 'Creating group',
      params,
    });

    const group = GroupEntity.create(
      { memberIds: params.memberIds, name: params.name },
      params.createdBy,
    );

    if (group.isErr()) {
      return err(group.error);
    }

    for (const memberId of params.memberIds) {
      const existingGroup = await this.groupRepository.findByMemberId(
        UniqueId.raw({ value: memberId }),
      );

      if (existingGroup) {
        const member = existingGroup.members.find((m) => m.id === memberId);
        Guard.defined(member);

        return err(
          new ApplicationError(`El miembro ${member.name} ya tiene un grupo`),
        );
      }
    }

    await this.unitOfWork.execute(async ({ groupRepository }) => {
      await groupRepository.save(group.value);
    });

    this.eventPublisher.dispatch(group.value);

    return ok(group.value);
  }
}
