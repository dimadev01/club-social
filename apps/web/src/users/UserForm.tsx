import { UserStatus, UserStatusLabel } from '@club-social/shared/users';
import { Form, Input, Select } from 'antd';

import { labelMapToSelectOptions } from '@/shared/lib/utils';

export interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
}

export type UserFormInitialValues = Partial<UserFormData>;

interface UserFormProps {
  disabled?: boolean;
  initialValues?: UserFormInitialValues;
  mode: 'create' | 'edit';
  onSubmit: (data: UserFormData) => void;
}

export function UserForm({
  disabled = false,
  initialValues,
  mode,
  onSubmit,
}: UserFormProps) {
  const [form] = Form.useForm<UserFormData>();

  const isEditMode = mode === 'edit';

  return (
    <Form<UserFormData>
      autoComplete="off"
      disabled={disabled}
      form={form}
      id="form"
      initialValues={initialValues}
      layout="vertical"
      name="form"
      onFinish={onSubmit}
      scrollToFirstError
    >
      <Form.Item<UserFormData>
        label="Nombre"
        name="firstName"
        rules={[{ required: true, whitespace: true }]}
      >
        <Input placeholder="Juan" />
      </Form.Item>
      <Form.Item<UserFormData>
        label="Apellido"
        name="lastName"
        rules={[{ required: true, whitespace: true }]}
      >
        <Input placeholder="Perez" />
      </Form.Item>
      <Form.Item<UserFormData>
        label="Email"
        name="email"
        rules={[{ required: true, type: 'email', whitespace: true }]}
        tooltip="Será su email de acceso"
      >
        <Input placeholder="juan.perez@example.com" type="email" />
      </Form.Item>

      {isEditMode && (
        <Form.Item<UserFormData>
          label="Estado"
          name="status"
          rules={[{ required: true }]}
        >
          <Select options={labelMapToSelectOptions(UserStatusLabel)} />
        </Form.Item>
      )}
    </Form>
  );
}
