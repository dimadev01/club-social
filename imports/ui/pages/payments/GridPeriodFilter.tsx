import { CloseCircleOutlined } from '@ant-design/icons';
import { Card, DatePicker, Flex, Space } from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import dayjsCustomParseFormat from 'dayjs/plugin/customParseFormat';
import { isEqual } from 'lodash';
import React, { useMemo, useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { DateFormatEnum } from '@shared/utils/date.utils';
import { Button } from '@ui/components/Button/Button';
import { getPresets } from '@ui/components/DatePicker/DatePicker.utils';

dayjs.extend(dayjsCustomParseFormat);

type Props = {
  props: FilterDropdownProps;
  title: string;
  value: string[];
};

export const GridPeriodFilter: React.FC<Props> = ({ value, title, props }) => {
  const presets = useMemo(() => getPresets(), []);

  const [state, setState] = useState<string[] | undefined>(
    value.length > 0 ? value : undefined,
  );

  useDeepCompareEffect(() => {
    if (!isEqual(props.selectedKeys, value)) {
      props.confirm({ closeDropdown: true });
    }
  }, [props.selectedKeys, value]);

  return (
    <Card size="small" title={title}>
      <Space direction="vertical">
        <DatePicker.RangePicker
          format={DateFormatEnum.DDMMYYYY}
          value={state ? [dayjs.utc(state[0]), dayjs.utc(state[1])] : undefined}
          onChange={(_, c) => {
            if (c) {
              const [from, to] = c;

              const values =
                from && to
                  ? [
                      dayjs
                        .utc(from, DateFormatEnum.DDMMYYYY)
                        .format(DateFormatEnum.DATE),
                      dayjs
                        .utc(to, DateFormatEnum.DDMMYYYY)
                        .format(DateFormatEnum.DATE),
                    ]
                  : undefined;

              props.setSelectedKeys(values ?? []);

              props.confirm({ closeDropdown: true });

              setState(values);
            } else {
              props.setSelectedKeys([]);

              setState(undefined);
            }
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

                setState(undefined);
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
