import { ARS } from '@dinero.js/currencies';
import { InputNumber, InputNumberProps } from 'antd';
import { isString } from 'lodash';
import React from 'react';

import { Money } from '@domain/common/value-objects/money.value-object';
import { NumberUtils } from '@shared/utils/number.utils';

type Props = InputNumberProps;

export const FormInputAmount: React.FC<Props> = ({ ...rest }) => (
  <InputNumber
    className="w-full"
    prefix={ARS.code}
    precision={0}
    step={1000}
    parser={(value) => NumberUtils.parseFromInputNumber(value ?? '')}
    formatter={(value) => {
      if (!value) {
        return '';
      }

      if (isString(value)) {
        const number = Number(value);

        if (Number.isNaN(number)) {
          return '';
        }

        return Money.fromNumber(number).format();
      }

      return Money.fromNumber(value ?? 0).format();
    }}
    {...rest}
  />
);
