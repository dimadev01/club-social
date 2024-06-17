import { BulbOutlined, TeamOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { ColumnFilterItem } from 'antd/es/table/interface';
import React from 'react';
import { GiTennisCourt } from 'react-icons/gi';

import {
  DueCategoryEnum,
  DueCategoryLabel,
  DueStatusEnum,
  DueStatusLabel,
} from '@domain/dues/due.enum';

export const DueCategoryIcon: {
  [x in DueCategoryEnum]: React.ReactNode;
} = {
  [DueCategoryEnum.ELECTRICITY]: <BulbOutlined />,
  [DueCategoryEnum.GUEST]: <TeamOutlined />,
  [DueCategoryEnum.MEMBERSHIP]: <GiTennisCourt />,
};

export abstract class DuesUIUtils {
  public static getStatusGridFilters(): ColumnFilterItem[] {
    return Object.values(DueStatusEnum)
      .sort((a, b) => DueStatusLabel[a].localeCompare(DueStatusLabel[b]))
      .map((status) => ({
        text: DueStatusLabel[status],
        value: status,
      }));
  }

  private static getCategoryOptions(
    prop: 'text' | 'label',
  ): ColumnFilterItem[] | DefaultOptionType[] {
    return Object.values(DueCategoryEnum)
      .sort((a, b) => DueCategoryLabel[a].localeCompare(DueCategoryLabel[b]))
      .map((category) => ({
        [prop]: (
          <Space>
            {DueCategoryIcon[category]}
            {DueCategoryLabel[category]}
          </Space>
        ),
        value: category,
      }));
  }

  public static getCategoryGridFilters(): ColumnFilterItem[] {
    return this.getCategoryOptions('text') as ColumnFilterItem[];
  }

  public static getCategorySelectOptions() {
    return this.getCategoryOptions('label') as DefaultOptionType[];
  }
}
