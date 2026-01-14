import { Entity } from '@/shared/domain/entity';
import { ok, Result } from '@/shared/domain/result';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

export interface GroupMemberProps {
  groupId: UniqueId;
  memberId: UniqueId;
}

export class GroupMemberEntity extends Entity {
  public get groupId(): UniqueId {
    return this._groupId;
  }

  public get memberId(): UniqueId {
    return this._memberId;
  }

  private _groupId: UniqueId;
  private _memberId: UniqueId;

  private constructor(props: GroupMemberProps) {
    super();

    this._groupId = props.groupId;
    this._memberId = props.memberId;
  }

  public static create(props: GroupMemberProps): Result<GroupMemberEntity> {
    const membership = new GroupMemberEntity(props);

    return ok(membership);
  }

  public static fromPersistence(props: GroupMemberProps): GroupMemberEntity {
    return new GroupMemberEntity(props);
  }
}
