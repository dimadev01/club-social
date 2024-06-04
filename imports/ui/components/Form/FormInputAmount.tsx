import { ARS } from '@dinero.js/currencies';
import { InputNumber, InputNumberProps } from 'antd';
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
    formatter={(value) =>
      value ? Money.fromNumber(Number(value)).format() : ''
    }
    {...rest}
  />
);
