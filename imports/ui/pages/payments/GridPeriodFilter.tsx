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
    { label: 'Hoy', value: [now, now.add(1, 'day')] },
    {
      label: 'Ayer',
      value: [now.subtract(1, 'day'), now],
    },
    {
      label: 'Esta semana',
      value: [now.startOf('week'), now],
    },
    {
      label: 'Este mes',
      value: [now.startOf('month'), now],
    },
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
    { label: 'Últimos 7 días', value: [now.subtract(7, 'days'), now] },
    { label: 'Últimos 14 días', value: [now.subtract(14, 'days'), now] },
    { label: 'Últimos 30 días', value: [now.subtract(30, 'days'), now] },
    { label: 'Últimos 90 días', value: [now.subtract(90, 'days'), now] },
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
            const [from, to] = v ?? [];

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
