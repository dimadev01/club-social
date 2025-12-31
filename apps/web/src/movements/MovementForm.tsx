import type dayjs from 'dayjs';

import { NumberFormat } from '@club-social/shared/lib';
import { DateFormats } from '@club-social/shared/lib';
import {
  MovementCategory,
  MovementCategoryOptions,
  MovementType,
  MovementTypeLabel,
} from '@club-social/shared/movements';
import { DatePicker, Input, InputNumber } from 'antd';

import { labelMapToSelectOptions } from '@/shared/lib/utils';
import { Form } from '@/ui/Form/Form';
import { Select } from '@/ui/Select';

export interface MovementFormData {
  amount: number;
  category: MovementCategory;
  date: dayjs.Dayjs;
  notes: null | string;
  type: MovementType;
}

export type MovementFormInitialValues = Partial<MovementFormData>;

interface MovementFormProps {
  disabled?: boolean;
  initialValues?: MovementFormInitialValues;
  onSubmit: (data: MovementFormData) => void;
}

export function MovementForm({
  disabled = false,
  initialValues,
  onSubmit,
}: MovementFormProps) {
  const [form] = Form.useForm<MovementFormData>();

  return (
    <Form<MovementFormData>
      disabled={disabled}
      form={form}
      id="form"
      initialValues={initialValues}
      name="form"
      onFinish={onSubmit}
    >
      <Form.Item<MovementFormData>
        label="Fecha"
        name="date"
        rules={[{ message: 'La fecha es requerida', required: true }]}
      >
        <DatePicker
          allowClear={false}
          className="w-full"
          format={DateFormats.date}
        />
      </Form.Item>

      <Form.Item<MovementFormData>
        label="Tipo"
        name="type"
        rules={[{ message: 'El tipo es requerido', required: true }]}
      >
        <Select options={labelMapToSelectOptions(MovementTypeLabel)} />
      </Form.Item>

      <Form.Item<MovementFormData>
        label="Categoría"
        name="category"
        rules={[{ message: 'La categoría es requerida', required: true }]}
      >
        <Select options={MovementCategoryOptions} />
      </Form.Item>

      <Form.Item<MovementFormData>
        label="Monto"
        name="amount"
        rules={[
          {
            message: 'El monto debe ser mayor a 0',
            min: 1,
            type: 'number',
          },
        ]}
      >
        <InputNumber<number>
          className="w-full"
          formatter={(value) => NumberFormat.format(Number(value))}
          min={0}
          parser={(value) => NumberFormat.parse(String(value))}
          precision={0}
          step={1000}
        />
      </Form.Item>

      <Form.Item<MovementFormData> label="Notas" name="notes">
        <Input.TextArea placeholder="Notas adicionales..." rows={3} />
      </Form.Item>
    </Form>
  );
}
