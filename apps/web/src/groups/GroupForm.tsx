import { type FormInstance } from 'antd';

import { MemberSearchSelect } from '@/members/MemberSearchSelect';
import { Form, Input } from '@/ui';

export interface GroupFormData {
  memberIds: string[];
  name: string;
}

export type GroupFormInitialValues = Partial<GroupFormData>;

interface GroupFormProps {
  disabled?: boolean;
  initialValues?: GroupFormInitialValues;
  onSubmit: (data: GroupFormData, form: FormInstance<GroupFormData>) => void;
}

export function GroupForm({
  disabled = false,
  initialValues,
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
        label="Socios"
        name="memberIds"
        rules={[
          { message: 'Debe seleccionar al menos un socio', required: true },
        ]}
      >
        <MemberSearchSelect mode="multiple" />
      </Form.Item>
    </Form>
  );
}
