import type { MemberSearchResultDto } from '@club-social/shared/members';

import { type FormInstance, InputNumber } from 'antd';

import { MemberSearchSelect } from '@/members/MemberSearchSelect';
import { Form, Input } from '@/ui';

export interface GroupFormData {
  discountPercent: number;
  memberIds: string[];
  name: string;
}

export type GroupFormInitialValues = Partial<GroupFormData>;

interface GroupFormProps {
  additionalMemberOptions?: MemberSearchResultDto[];
  disabled?: boolean;
  initialValues?: GroupFormInitialValues;
  loading?: boolean;
  onSubmit: (data: GroupFormData, form: FormInstance<GroupFormData>) => void;
}

export function GroupForm({
  additionalMemberOptions = [],
  disabled = false,
  initialValues,
  loading = false,
  onSubmit,
}: GroupFormProps) {
  const [form] = Form.useForm<GroupFormData>();

  return (
    <Form<GroupFormData>
      disabled={disabled}
      form={form}
      id="form"
      initialValues={initialValues}
      name="form"
      onFinish={(values) => onSubmit(values, form)}
    >
      <Form.Item<GroupFormData>
        label="Nombre"
        name="name"
        rules={[
          {
            message: 'El nombre es requerido',
            required: true,
            whitespace: true,
          },
        ]}
      >
        <Input placeholder="Nombre del grupo" />
      </Form.Item>

      <Form.Item<GroupFormData>
        label="Descuento"
        name="discountPercent"
        rules={[
          { message: 'El descuento es requerido', required: true },
          {
            max: 99,
            message: 'El descuento debe estar entre 0 y 99',
            min: 0,
            type: 'number',
          },
        ]}
      >
        <InputNumber max={99} min={0} precision={0} suffix="%" />
      </Form.Item>

      <Form.Item<GroupFormData>
        label="Socios"
        name="memberIds"
        rules={[
          { message: 'Debe seleccionar al menos un socio', required: true },
        ]}
      >
        <MemberSearchSelect
          additionalOptions={additionalMemberOptions}
          loading={loading}
          mode="multiple"
        />
      </Form.Item>
    </Form>
  );
}
