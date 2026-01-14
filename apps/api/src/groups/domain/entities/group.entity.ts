import { AuditedAggregateRoot } from '@/shared/domain/audited-aggregate-root';
import { ApplicationError } from '@/shared/domain/errors/application.error';
import { PersistenceMeta } from '@/shared/domain/persistence-meta';
import { err, ok, Result } from '@/shared/domain/result';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { GroupMemberEntity } from './group-member.entity';

export interface CreateGroupProps {
  memberIds: string[];
  name: string;
}

export interface GroupProps {
  members: GroupMemberEntity[];
  name: string;
}

export class GroupEntity extends AuditedAggregateRoot {
  public get members(): GroupMemberEntity[] {
    return [...this._members];
  }

  public get name(): string {
    return this._name;
  }

  private _members: GroupMemberEntity[];
  private _name: string;

  private constructor(props: GroupProps, meta?: PersistenceMeta) {
    super(meta?.id, meta?.audit);

    this._name = props.name;
    this._members = props.members;
  }

  public static create(
    props: CreateGroupProps,
    createdBy: string,
  ): Result<GroupEntity> {
    const group = new GroupEntity(
      {
        members: [],
        name: props.name,
      },
      {
        audit: { createdBy },
        id: UniqueId.generate(),
      },
    );

    for (const memberId of props.memberIds) {
      const groupMember = GroupMemberEntity.create({
        groupId: group.id,
        memberId: UniqueId.raw({ value: memberId }),
      });

      if (groupMember.isErr()) {
        return err(groupMember.error);
      }

      group.addMember(groupMember.value);
    }

    if (group._members.length === 0) {
      return err(
        new ApplicationError('El grupo debe tener al menos un miembro'),
      );
    }

    if (group._members.length < 3) {
      return err(
        new ApplicationError('El grupo debe tener al menos 3 miembros'),
      );
    }

    return ok(group);
  }

  public static fromPersistence(
    props: GroupProps,
    meta: PersistenceMeta,
  ): GroupEntity {
    return new GroupEntity(props, meta);
  }

  public addMember(groupMember: GroupMemberEntity): void {
    this._members.push(groupMember);
  }

  public removeMember(groupMember: GroupMemberEntity): void {
    this._members = this._members.filter(
      (m) => !m.memberId.equals(groupMember.memberId),
    );
  }

  public updateName(name: string, updatedBy: string): void {
    this._name = name;

    this.markAsUpdated(updatedBy);
  }
}
