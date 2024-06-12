import { CloseCircleOutlined } from '@ant-design/icons';
import { Card, DatePicker, Flex, Space } from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import React from 'react';

import { DateFormatEnum } from '@shared/utils/date.utils';
import { Button } from '@ui/components/Button/Button';
import { getPresets } from '@ui/components/DatePicker/DatePicker.utils';

type Props = {
  props: FilterDropdownProps;
  title: string;
  value: string[];
};

export const GridPeriodFilter: React.FC<Props> = ({ value, title, props }) => (
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
        presets={getPresets()}
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
