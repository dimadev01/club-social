import { StopOutlined } from '@ant-design/icons';
import { ButtonProps, Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState } from 'react';

import { PermissionEnum, type ScopeEnum } from '@domain/roles/role.enum';
import { SecurityUtils } from '@infra/security/security.utils';
import { Button } from '@ui/components/Button';
import { Popconfirm } from '@ui/components/Popconfirm/Popconfirm';

export type FormVoidButtonProps = ButtonProps & {
  onConfirm: (reason: string) => void;
  scope: ScopeEnum;
};

type FormValues = {
  reason: string;
};

export const FormVoidButton: React.FC<FormVoidButtonProps> = ({
  onConfirm,
  scope,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [form] = useForm<FormValues>();

  if (!SecurityUtils.isInRole(PermissionEnum.VOID, scope)) {
    return false;
  }

  const handleConfirm = async () => {
    const values = await form.validateFields();

    setIsOpen(false);

    onConfirm(values.reason);
  };

  return (
    <Popconfirm
      open={isOpen}
      description={
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            reason: undefined,
          }}
        >
          <Form.Item
            label="Motivo"
            name="reason"
            rules={[{ required: true, whitespace: true }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      }
      onCancel={() => setIsOpen(false)}
      onConfirm={() => handleConfirm()}
    >
      <Button
        onClick={() => setIsOpen(true)}
        icon={<StopOutlined />}
        danger
        {...rest}
      >
        Anular
      </Button>
    </Popconfirm>
  );
};
