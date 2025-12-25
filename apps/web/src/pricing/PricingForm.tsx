import type dayjs from 'dayjs';

import { DueCategory, DueCategoryLabel } from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';
import { DateFormats } from '@club-social/shared/lib';
import {
  type MemberCategory,
  MemberCategoryOptions,
} from '@club-social/shared/members';
import { DatePicker, InputNumber } from 'antd';

import { Form } from '@/ui/Form/Form';
import { Select } from '@/ui/Select';

export interface PricingFormData {
  amount: number;
  dueCategory: DueCategory;
  effectiveFrom: dayjs.Dayjs;
  memberCategory: MemberCategory;
}

export type PricingFormInitialValues = Partial<PricingFormData>;

interface PricingFormProps {
  disabled?: boolean;
  initialValues?: PricingFormInitialValues;
  mode: 'create' | 'edit';
  onSubmit: (data: PricingFormData) => void;
}

export function PricingForm({
  disabled = false,
  initialValues,
  mode,
  onSubmit,
}: PricingFormProps) {
  const [form] = Form.useForm<PricingFormData>();

  const isEditMode = mode === 'edit';

  return (
    <Form<PricingFormData>
      disabled={disabled}
      form={form}
      id="form"
      initialValues={initialValues}
      name="form"
      onFinish={onSubmit}
    >
      <Form.Item<PricingFormData>
        label="Fecha"
        name="effectiveFrom"
        rules={[{ message: 'La fecha es requerida', required: true }]}
      >
        <DatePicker
          allowClear={false}
          className="w-full"
          format={DateFormats.date}
          picker="date"
        />
      </Form.Item>

      <Form.Item<PricingFormData>
        label="Categoría de deuda"
        name="dueCategory"
        rules={[
          { message: 'La categoría de deuda es requerida', required: true },
        ]}
      >
        <Select
          disabled={isEditMode}
          options={Object.entries(DueCategoryLabel).map(([key, value]) => ({
            label: value,
            value: key,
          }))}
        />
      </Form.Item>

      <Form.Item<PricingFormData>
        label="Categoría de socio"
        name="memberCategory"
        rules={[
          { message: 'La categoría de socio es requerida', required: true },
        ]}
      >
        <Select disabled={isEditMode} options={MemberCategoryOptions} />
      </Form.Item>

      <Form.Item<PricingFormData>
        label="Monto"
        name="amount"
        rules={[
          {
            message: 'El monto debe ser mayor a 1',
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
    </Form>
  );
}
