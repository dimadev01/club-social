import React from 'react';
import { Input } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button } from '@ui/components/Button';

type Props = {
  add: () => void;
  addTooltip?: string;
  fieldName: number;
  index: number;
  inputType?: string;
  onChange?: (value: string) => void;
  remove: (name: number | number[]) => void;
  removeTooltip?: string;
  value?: string;
};

export const FormListInput: React.FC<Props> = ({
  value,
  onChange,
  index,
  add,
  remove,
  fieldName,
  addTooltip = 'Agregar',
  removeTooltip = 'Quitar',
  inputType,
}) => (
  <Input.Group compact>
    <Input
      value={value}
      allowClear
      onChange={(e) => {
        if (onChange) {
          onChange(e.target.value);
        }
      }}
      style={{ width: `calc(100% - 32px)` }}
      type={inputType}
    />

    {index === 0 && (
      <Button
        tooltip={{ title: addTooltip }}
        icon={<PlusCircleOutlined />}
        onClick={() => add()}
      />
    )}

    {index > 0 && (
      <Button
        tooltip={{ title: removeTooltip }}
        icon={<MinusCircleOutlined />}
        onClick={() => remove(fieldName)}
      />
    )}
  </Input.Group>
);
