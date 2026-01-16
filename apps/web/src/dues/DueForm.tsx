import type { MemberSearchResultDto } from '@club-social/shared/members';
import type dayjs from 'dayjs';

import { DueCategory, DueCategoryLabel } from '@club-social/shared/dues';
import { DateFormats, NumberFormat } from '@club-social/shared/lib';
import { type FormInstance, Radio } from 'antd';
import { useEffect, useState } from 'react';

import { MemberSearchSelect } from '@/members/MemberSearchSelect';
import { useMemberById } from '@/members/useMemberById';
import { useFindPrice } from '@/pricing/useFindPrice';
import { labelMapToSelectOptions } from '@/shared/lib/utils';
import { DatePicker, Form, Input, InputNumber } from '@/ui';

import { DueCategoryIconLabel } from './DueCategoryIconLabel';

export interface DueFormData {
  amount: number;
  category: DueCategory;
  date: dayjs.Dayjs;
  memberIds: string[];
  notes: null | string;
}

export type DueFormInitialValues = Partial<DueFormData>;

interface DueFormProps {
  additionalMemberOptions?: MemberSearchResultDto[];
  disabled?: boolean;
  initialValues?: DueFormInitialValues;
  loading?: boolean;
  mode: 'create' | 'edit';
  onSubmit: (data: DueFormData, form: FormInstance<DueFormData>) => void;
}

export function DueForm({
  additionalMemberOptions = [],
  disabled = false,
  initialValues,
  loading = false,
  mode,
  onSubmit,
}: DueFormProps) {
  const [selectedFirstMember, setSelectedFirstMember] =
    useState<MemberSearchResultDto>();

  const [form] = Form.useForm<DueFormData>();
  const { setFieldValue } = form;
  const formCategory =
    Form.useWatch('category', form) ?? initialValues?.category;

  // Queries
  const { data: member, isLoading: isMemberLoading } = useMemberById(
    initialValues?.memberIds?.[0],
  );

  const { data: pricing, isLoading: isPriceLoading } = useFindPrice({
    dueCategory: formCategory,
    memberCategory: selectedFirstMember?.category,
    memberId: selectedFirstMember?.id,
  });

  useEffect(() => {
    if (pricing) {
      setFieldValue('amount', NumberFormat.fromCents(pricing.amount));
    }
  }, [pricing, setFieldValue]);

  const isEditMode = mode === 'edit';

  if (member) {
    additionalMemberOptions.push({
      category: member.category,
      id: member.id,
      name: member.name,
      status: member.status,
    });
  }

  return (
    <Form<DueFormData>
      disabled={disabled}
      form={form}
      id="form"
      initialValues={initialValues}
      name="form"
      onFinish={(values) => onSubmit(values, form)}
    >
      <Form.Item<DueFormData>
        label="Categoría"
        name="category"
        rules={[{ message: 'La categoría es requerida', required: true }]}
      >
        <Radio.Group
          disabled={isEditMode}
          options={labelMapToSelectOptions(DueCategoryLabel).map((option) => ({
            label: DueCategoryIconLabel({
              category: option.value as DueCategory,
            }),
            value: option.value,
          }))}
        />
      </Form.Item>

      <Form.Item<DueFormData>
        label="Fecha"
        name="date"
        rules={[{ message: 'La fecha es requerida', required: true }]}
      >
        <DatePicker
          allowClear={false}
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
          loading={loading || isMemberLoading}
          mode={isEditMode ? undefined : 'multiple'}
          onMembersChange={(data) => {
            if (!selectedFirstMember && data?.[0]) {
              setSelectedFirstMember(data[0]);
            }
          }}
          placeholder="Buscar y seleccionar socios..."
        />
      </Form.Item>

      <Form.Item<DueFormData>
        help={
          pricing?.isGroupPricing ? 'Aplicado descuento de grupo' : undefined
        }
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
          disabled={isPriceLoading}
          formatter={(value) => NumberFormat.format(Number(value))}
          min={0}
          parser={(value) => NumberFormat.parse(String(value))}
          precision={0}
          step={1000}
        />
      </Form.Item>

      <Form.Item<DueFormData> label="Notas" name="notes">
        <Input.TextArea placeholder="Notas adicionales..." rows={1} />
      </Form.Item>
    </Form>
  );
}
