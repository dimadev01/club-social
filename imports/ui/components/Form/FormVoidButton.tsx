import { StopOutlined } from '@ant-design/icons';
import { App, ButtonProps, Form, Input } from 'antd';
import React, { useState } from 'react';

import { PermissionEnum, type ScopeEnum } from '@domain/roles/role.enum';
import { SecurityUtils } from '@infra/security/security.utils';
import { Button } from '@ui/components/Button';

export type FormDeleteButtonProps = ButtonProps & {
  onConfirm: (reason: string) => void;
  scope: ScopeEnum;
};

export const FormVoidButton: React.FC<FormDeleteButtonProps> = ({
  onConfirm,
  scope,
  ...rest
}) => {
  const { modal } = App.useApp();

  const [reason, setReason] = useState<string>('');

  const [isError, setIsError] = useState<boolean>(false);

  if (!SecurityUtils.isInRole(PermissionEnum.VOID, scope)) {
    return false;
  }

  const handleConfirm = async () => {
    await modal.confirm({
      content: (
        <Form
          onFinish={(values) => {
            console.log(values);
          }}
        >
          <Form.Item
            label="Motivo"
            rules={[{ required: true, whitespace: true }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      ),
      // onOk: () => handleConfirm(),
      title: 'Ingrese un motivo',
    });
  };

  return (
    <Button
      onClick={async () => handleConfirm()}
      icon={<StopOutlined />}
      danger
      {...rest}
    >
      Anular
    </Button>
  );
};
