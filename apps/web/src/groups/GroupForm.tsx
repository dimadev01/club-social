import { Input } from 'antd';

import { Form } from '@/ui';

export interface GroupFormData {
  name: string;
}

export type GroupFormInitialValues = Partial<GroupFormData>;

interface GroupFormProps {
  disabled?: boolean;
  initialValues?: GroupFormInitialValues;
  onSubmit: (data: GroupFormData) => void;
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
      onFinish={onSubmit}
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
    </Form>
  );
}
