import { ClearOutlined } from '@ant-design/icons';
import { Card, DatePicker, Flex, Space, TimeRangePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState } from 'react';

import { Button } from '@ui/components/Button';

const presets: TimeRangePickerProps['presets'] = [
  { label: 'Ayer', value: [dayjs().add(-1, 'd'), dayjs()] },
  { label: 'Últimos 7 días', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: 'Últimos 14 días', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: 'Últimos 30 días', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: 'Últimos 90 días', value: [dayjs().add(-90, 'd'), dayjs()] },
  {
    label: 'Semana pasada',
    value: [
      dayjs().subtract(1, 'week').startOf('week'),
      dayjs().subtract(1, 'week').endOf('week'),
    ],
  },
  {
    label: 'Mes pasado',
    value: [
      dayjs().subtract(1, 'month').startOf('month'),
      dayjs().subtract(1, 'month').endOf('month'),
    ],
  },
];

type Props = {
  onChange: (value: [Dayjs, Dayjs] | undefined) => void;
};

export const GridPeriodFilter: React.FC<Props> = ({ onChange }) => {
  const [rangeFilter, setRangeFilter] = useState<[Dayjs, Dayjs] | undefined>(
    undefined,
  );

  return (
    <Card>
      <Space direction="vertical">
        <DatePicker.RangePicker
          value={rangeFilter}
          onChange={(value) => {
            setRangeFilter(value as [Dayjs, Dayjs]);

            onChange(value as [Dayjs, Dayjs]);
          }}
          presets={presets}
        />

        {rangeFilter && (
          <Flex justify="center">
            <Button
              icon={<ClearOutlined />}
              size="small"
              onClick={() => {
                setRangeFilter(undefined);

                onChange(undefined);
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
