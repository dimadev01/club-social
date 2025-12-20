import { Input, Modal } from 'antd';
import { useState } from 'react';

import { Form } from '@/ui/Form/Form';

interface FormSchema {
  reason: string;
}

interface Props {
  onCancel: () => void;
  onConfirm: (reason: string) => void;
  open: boolean;
}

export function VoidDueModal({ onCancel, onConfirm, open }: Props) {
  const [form] = Form.useForm<FormSchema>();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleConfirm = async () => {
    setConfirmLoading(true);

    try {
      const values = await form.validateFields();
      setConfirmLoading(false);

      onConfirm(values.reason);
      form.resetFields();
    } catch {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
    setConfirmLoading(false);
  };

  return (
    <Modal
      cancelText="Cancelar"
      confirmLoading={confirmLoading}
      okButtonProps={{ danger: true }}
      okText="Anular"
      onCancel={handleCancel}
      onOk={handleConfirm}
      open={open}
      title="Ingrese la razón de la anulación"
    >
      <Form<FormSchema> form={form}>
        <Form.Item<FormSchema>
          name="reason"
          rules={[
            {
              message: 'La razón de anulación es requerida',
              required: true,
              whitespace: true,
            },
          ]}
        >
          <Input.TextArea placeholder="Razón de la anulación" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
