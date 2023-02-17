import React from 'react';
import { Input } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button } from '@ui/components/Button';

type Props = {
  add: () => void;
  fieldName: number;
  index: number;
  onChange?: (value: string) => void;
  remove: (name: number | number[]) => void;
  value?: string;
};

export const InputEmailList: React.FC<Props> = ({
  value,
  onChange,
  index,
  add,
  remove,
  fieldName,
}) => (
  <Input.Group compact>
    <Input
      value={value}
      onChange={(e) => {
        if (onChange) {
          onChange(e.target.value);
        }
      }}
      style={{ width: `calc(100% - 32px)` }}
      type="email"
    />

    {index === 0 && (
      <Button
        tooltip={{ title: 'Agregar email' }}
        icon={<PlusCircleOutlined />}
        onClick={() => add()}
      />
    )}
    {index > 0 && (
      <Button
        tooltip={{ title: 'Quitar email' }}
        icon={<MinusCircleOutlined />}
        onClick={() => remove(fieldName)}
      />
    )}
  </Input.Group>
);
