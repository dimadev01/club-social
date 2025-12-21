import type { IMemberSearchResultDto } from '@club-social/shared/members';
import type dayjs from 'dayjs';

import { DueCategory, DueCategoryLabel } from '@club-social/shared/dues';
import { DatePicker, Input, InputNumber } from 'antd';

import { MemberSearchSelect } from '@/members/MemberSearchSelect';
import { DateFormats } from '@/shared/lib/date-format';
import { NumberFormat } from '@/shared/lib/number-format';
import { Form } from '@/ui/Form';
import { Select } from '@/ui/Select';

export interface DueFormData {
  amount: number;
  category: DueCategory;
  date: dayjs.Dayjs;
  memberIds: string[];
  notes: null | string;
}

export type DueFormInitialValues = Partial<DueFormData>;

interface DueFormProps {
  additionalMemberOptions?: IMemberSearchResultDto[];
  disabled?: boolean;
  initialValues?: DueFormInitialValues;
  loading?: boolean;
  mode: 'create' | 'edit';
  onSubmit: (data: DueFormData) => void;
}

export function DueForm({
  additionalMemberOptions = [],
  disabled = false,
  initialValues,
  loading = false,
  mode,
  onSubmit,
}: DueFormProps) {
  const [form] = Form.useForm<DueFormData>();
  const formCategory = Form.useWatch('category', form);

  const isEditMode = mode === 'edit';

  return (
    <Form<DueFormData>
      disabled={disabled}
      form={form}
      id="form"
      initialValues={initialValues}
      name="form"
      onFinish={onSubmit}
    >
      <Form.Item<DueFormData>
        label="Fecha"
        name="date"
        rules={[{ message: 'La fecha es requerida', required: true }]}
      >
        <DatePicker
          allowClear={false}
          className="w-full"
          disabled={isEditMode}
          format={
            formCategory === DueCategory.MEMBERSHIP
              ? DateFormats.monthYear
              : DateFormats.date
          }
          picker={formCategory === DueCategory.MEMBERSHIP ? 'month' : 'date'}
        />
      </Form.Item>

      <Form.Item<DueFormData>
        label={isEditMode ? 'Socio' : 'Socio/s'}
        name="memberIds"
        rules={[
          { message: 'Debe seleccionar al menos un socio', required: true },
        ]}
      >
        <MemberSearchSelect
          additionalOptions={additionalMemberOptions}
          disabled={isEditMode}
          loading={loading}
          mode={isEditMode ? undefined : 'multiple'}
          placeholder="Buscar y seleccionar socios..."
        />
      </Form.Item>

      <Form.Item<DueFormData>
        label="Categoría"
        name="category"
        rules={[{ message: 'La categoría es requerida', required: true }]}
      >
        <Select
          disabled={isEditMode}
          options={Object.entries(DueCategoryLabel).map(([key, value]) => ({
            label: value,
            value: key,
          }))}
        />
      </Form.Item>

      <Form.Item<DueFormData>
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

      <Form.Item<DueFormData> label="Notas" name="notes">
        <Input.TextArea placeholder="Notas adicionales..." rows={3} />
      </Form.Item>
    </Form>
  );
}
