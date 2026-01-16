import { Inject, Injectable } from '@nestjs/common';

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

import { GroupMemberEntity } from '../domain/entities/group-member.entity';
import {
  GROUP_REPOSITORY_PROVIDER,
  type GroupRepository,
} from '../domain/group.repository';
import { GroupDiscount } from '../domain/value-objects/group-discount.vo';

interface UpdateGroupParams {
  discountPercent: number;
  id: string;
  memberIds: string[];
  name: string;
  updatedBy: string;
}

@Injectable()
export class UpdateGroupUseCase extends UseCase<void> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(GROUP_REPOSITORY_PROVIDER)
    private readonly groupRepository: GroupRepository,
    @Inject(UNIT_OF_WORK_PROVIDER)
    private readonly unitOfWork: UnitOfWork,
    private readonly eventPublisher: DomainEventPublisher,
  ) {
    super(logger);
  }

  public async execute(params: UpdateGroupParams): Promise<Result<void>> {
    this.logger.info({
      message: 'Updating group',
      params,
    });

    for (const memberId of params.memberIds) {
      const existingGroup = await this.groupRepository.findByMemberIdReadModel(
        UniqueId.raw({ value: memberId }),
      );

      if (existingGroup && existingGroup.id !== params.id) {
        const member = existingGroup.members.find((m) => m.id === memberId);
        Guard.defined(member);

        return err(
          new ApplicationError(
            `El miembro ${member.name} ya está en otro grupo`,
          ),
        );
      }
    }

    const group = await this.groupRepository.findByIdOrThrow(
      UniqueId.raw({ value: params.id }),
    );

    const memberIdsToAdd = params.memberIds.filter(
      (memberId) => !group.members.some((m) => m.memberId.value === memberId),
    );
    const memberIdsToRemove = group.members
      .map((m) => m.memberId.value)
      .filter((memberId) => !params.memberIds.includes(memberId));

    for (const memberId of memberIdsToAdd) {
      const groupMember = GroupMemberEntity.create({
        groupId: group.id,
        memberId: UniqueId.raw({ value: memberId }),
      });

      if (groupMember.isErr()) {
        return err(groupMember.error);
      }

      group.addMember(groupMember.value);
    }

    for (const memberId of memberIdsToRemove) {
      const groupMember = group.members.find(
        (m) => m.memberId.value === memberId,
      );
      Guard.defined(groupMember);

      group.removeMember(groupMember);
    }

    if (params.discountPercent !== group.discount.value) {
      const discount = GroupDiscount.create(params.discountPercent);

      if (discount.isErr()) {
        return err(discount.error);
      }

      group.updateDiscount(discount.value, params.updatedBy);
    }

    const isGroupValid = group.isValid();

    if (!isGroupValid) {
      return err(
        new ApplicationError('El grupo debe tener al menos 3 miembros'),
      );
    }

    await this.unitOfWork.execute(async ({ groupRepository }) => {
      await groupRepository.save(group);
    });

    this.eventPublisher.dispatch(group);

    return ok();
  }
}
