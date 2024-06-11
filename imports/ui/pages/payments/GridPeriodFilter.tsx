import { CloseCircleOutlined } from '@ant-design/icons';
import { Card, DatePicker, Flex, Space, TimeRangePickerProps } from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import React from 'react';

import { DateFormatEnum } from '@shared/utils/date.utils';
import { Button } from '@ui/components/Button/Button';

type Props = {
  props: FilterDropdownProps;
  title: string;
  value: string[];
};

export const GridPeriodFilter: React.FC<Props> = ({ value, title, props }) => {
  const now = dayjs();

  const presets: TimeRangePickerProps['presets'] = [
    { label: 'Ayer', value: [now.add(-1, 'd'), now] },
    { label: 'Últimos 7 días', value: [now.add(-7, 'd'), now] },
    { label: 'Últimos 14 días', value: [now.add(-14, 'd'), now] },
    { label: 'Últimos 30 días', value: [now.add(-30, 'd'), now] },
    { label: 'Últimos 90 días', value: [now.add(-90, 'd'), now] },
    {
      label: 'Semana pasada',
      value: [
        now.subtract(1, 'week').startOf('week'),
        now.subtract(1, 'week').endOf('week'),
      ],
    },
    {
      label: 'Mes pasado',
      value: [
        now.subtract(1, 'month').startOf('month'),
        now.subtract(1, 'month').endOf('month'),
      ],
    },
  ];

  return (
    <Card size="small" title={title}>
      <Space direction="vertical">
        <DatePicker.RangePicker
          value={
            value.length > 0
              ? [dayjs.utc(value[0]), dayjs.utc(value[1])]
              : undefined
          }
          onChange={(v) => {
            const [from, to] = v || [];

            const fromDate = from?.format(DateFormatEnum.DATE);

            const toDate = to?.format(DateFormatEnum.DATE);

            props.setSelectedKeys(fromDate && toDate ? [fromDate, toDate] : []);

            props.confirm({ closeDropdown: true });
          }}
          presets={presets}
        />

        {value.length > 0 && (
          <Flex justify="center">
            <Button
              icon={<CloseCircleOutlined />}
              size="small"
              onClick={() => {
                props.setSelectedKeys([]);

                props.confirm({ closeDropdown: true });
              }}
            >
              Limpiar
            </Button>
          </Flex>
        )}
      </Space>
    </Card>
  );
};
