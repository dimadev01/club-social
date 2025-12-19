import { StopOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm } from 'antd';
import { useState } from 'react';

import { Form } from '@/ui/Form/Form';

interface FormSchema {
  reason: string;
}

interface Props {
  onConfirm: (reason: string) => void;
}

export function VoidDueButton({ onConfirm }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm<FormSchema>();

  const handleConfirm = async () => {
    const values = await form.validateFields();
    onConfirm(values.reason);
    setIsOpen(false);
  };

  return (
    <Popconfirm
      description={
        <Form<FormSchema> form={form} onFinish={handleConfirm}>
          <Form.Item<FormSchema>
            name="reason"
            rules={[{ required: true, whitespace: true }]}
          >
            <Input.TextArea placeholder="Razón de la anulación" rows={4} />
          </Form.Item>
        </Form>
      }
      okText="Anular"
      onCancel={() => setIsOpen(false)}
      onConfirm={() => handleConfirm()}
      open={isOpen}
      title="¿Estás seguro de querer anular la deuda?"
    >
      <Button
        danger
        htmlType="button"
        icon={<StopOutlined />}
        onClick={() => setIsOpen(true)}
        type="default"
      >
        Anular deuda
      </Button>
    </Popconfirm>
  );
}
