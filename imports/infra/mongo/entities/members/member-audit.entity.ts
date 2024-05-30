import { IsNotEmpty, IsString } from 'class-validator';

import { MemberEntity } from '@infra/mongo/entities/members/member.entity';

export class MemberAuditEntity extends MemberEntity {
  @IsNotEmpty()
  @IsString()
  public parentId: string;

  public constructor(props: MemberAuditEntity) {
    super(props);

    this.parentId = props.parentId;
  }
}
