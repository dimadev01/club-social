import type { MemberSearchResultDto } from '@club-social/shared/members';
import type dayjs from 'dayjs';

import { NumberFormat } from '@club-social/shared/lib';
import { DateFormats } from '@club-social/shared/lib';
import {
  MemberLedgerEntryMovementType,
  MemberLedgerEntryMovementTypeLabel,
} from '@club-social/shared/members';
import { DatePicker, Input, InputNumber } from 'antd';

import { MemberSearchSelect } from '@/members/MemberSearchSelect';
import { useMemberById } from '@/members/useMemberById';
import { labelMapToSelectOptions } from '@/shared/lib/utils';
import { Form, Select } from '@/ui';

export interface MemberLedgerEntryFormData {
  amount: number;
  date: dayjs.Dayjs;
  memberId: string;
  movementType: MemberLedgerEntryMovementType;
  notes: null | string;
}

export type MemberLedgerEntryFormInitialValues =
  Partial<MemberLedgerEntryFormData>;

interface MemberLedgerEntryFormProps {
  disabled?: boolean;
  initialValues?: MemberLedgerEntryFormInitialValues;
  onSubmit: (data: MemberLedgerEntryFormData) => void;
}

export function MemberLedgerEntryForm({
  disabled = false,
  initialValues,
  onSubmit,
}: MemberLedgerEntryFormProps) {
  const [form] = Form.useForm<MemberLedgerEntryFormData>();

  const { data: member, isLoading: isMemberLoading } = useMemberById(
    initialValues?.memberId,
  );

  const additionalOptions: MemberSearchResultDto[] = member
    ? [
        {
          category: member.category,
          id: member.id,
          name: member.name,
          status: member.status,
        },
      ]
    : [];

  return (
    <Form<MemberLedgerEntryFormData>
      disabled={disabled || isMemberLoading}
      form={form}
      id="form"
      initialValues={initialValues}
      name="form"
      onFinish={onSubmit}
    >
      <Form.Item<MemberLedgerEntryFormData>
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

      <Form.Item<MemberLedgerEntryFormData>
        label="Socio"
        name="memberId"
        rules={[{ message: 'Debe seleccionar un socio', required: true }]}
      >
        <MemberSearchSelect
          additionalOptions={additionalOptions}
          loading={isMemberLoading}
          placeholder="Buscar y seleccionar socio..."
        />
      </Form.Item>

      <Form.Item<MemberLedgerEntryFormData>
        label="Tipo"
        name="movementType"
        rules={[{ message: 'El tipo es requerido', required: true }]}
      >
        <Select
          options={labelMapToSelectOptions(MemberLedgerEntryMovementTypeLabel)}
        />
      </Form.Item>

      <Form.Item<MemberLedgerEntryFormData>
        label="Monto"
        name="amount"
        rules={[
          {
            message: 'El monto es requerido',
            required: true,
          },
          {
            message: 'El monto debe ser mayor a cero',
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

      <Form.Item<MemberLedgerEntryFormData> label="Notas" name="notes">
        <Input.TextArea placeholder="Notas adicionales..." rows={3} />
      </Form.Item>
    </Form>
  );
}
