import { Card, List, Space, Statistic } from 'antd';
import React from 'react';
import invariant from 'tiny-invariant';

import { Money } from '@domain/common/value-objects/money.value-object';
import {
  DueCategoryEnum,
  DueCategoryLabel,
  DueStatusEnum,
} from '@domain/dues/due.enum';
import { DuesIcon } from '@ui/components/Icons/DuesIcon';
import { useDuesTotals } from '@ui/hooks/dues/useDuesTotals';
import { useUserContext } from '@ui/providers/UserContext';

export const DuesByMemberAnalytics = () => {
  const { member } = useUserContext();

  invariant(member);

  const { data: dues, isLoading: isLoadingDues } = useDuesTotals({
    filterByCategory: [],
    filterByCreatedAt: [],
    filterByDate: [],
    filterByMember: [member._id],
    filterByStatus: [
      DueStatusEnum.PAID,
      DueStatusEnum.PENDING,
      DueStatusEnum.PARTIALLY_PAID,
    ],
  });

  return (
    <Card
      title={
        <Space>
          <DuesIcon />
          <span>Mi balance con el Club</span>
        </Space>
      }
    >
      <List
        dataSource={[
          <Statistic
            title={`Pendiente de ${DueCategoryLabel[DueCategoryEnum.MEMBERSHIP]}`}
            loading={isLoadingDues}
            prefix="$"
            value={Money.from({ amount: dues?.membership }).toInteger()}
          />,
          <Statistic
            title={`Pendiente de ${DueCategoryLabel[DueCategoryEnum.ELECTRICITY]}`}
            loading={isLoadingDues}
            prefix="$"
            value={Money.from({ amount: dues?.electricity }).toInteger()}
          />,
          <Statistic
            title={`Pendiente de ${DueCategoryLabel[DueCategoryEnum.GUEST]}`}
            loading={isLoadingDues}
            prefix="$"
            value={Money.from({ amount: dues?.guest }).toInteger()}
          />,
          <Statistic
            title="Pendiente Total"
            loading={isLoadingDues}
            prefix="$"
            value={Money.from({ amount: dues?.total }).toInteger()}
          />,
        ]}
        grid={{ column: 4, lg: 4, md: 4, sm: 4, xl: 4, xs: 2 }}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </Card>
  );
};
