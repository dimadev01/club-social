import { ColumnFilterItem } from 'antd/es/table/interface';

import { MemberDto } from '@application/members/dtos/member.dto';
import { MemberStatusEnum } from '@domain/members/member.enum';

interface GetMembersForFilterOptions {
  disableInactive?: boolean;
}

export abstract class GridUtils {
  public static getMembersForFilter(
    members?: MemberDto[],
    options: GetMembersForFilterOptions = {
      disableInactive: true,
    },
  ): ColumnFilterItem[] {
    return (
      members?.map((member) => {
        const isInactive = member.status === MemberStatusEnum.INACTIVE;

        return {
          text: `${member.name} ${options.disableInactive && isInactive ? '(inactivo)' : ''}`,
          value: member.id,
        };
      }) ?? []
    );
  }
}
