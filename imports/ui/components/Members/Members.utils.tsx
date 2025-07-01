import { ColumnFilterItem } from 'antd/es/table/interface';

import {
  MemberStatusEnum,
  MemberStatusLabel,
} from '@domain/members/member.enum';

export abstract class MembersUIUtils {
  public static getStatusGridFilters(): ColumnFilterItem[] {
    return Object.values(MemberStatusEnum)
      .sort((a, b) => MemberStatusLabel[a].localeCompare(MemberStatusLabel[b]))
      .map((status) => ({
        text: MemberStatusLabel[status],
        value: status,
      }));
  }
}
