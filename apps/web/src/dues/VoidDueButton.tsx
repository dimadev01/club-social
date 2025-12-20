import { StopOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useState } from 'react';

import { VoidDueModal } from './VoidDueModal';

interface Props {
  onConfirm: (reason: string) => void;
}

export function VoidDueButton({ onConfirm }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        danger
        htmlType="button"
        icon={<StopOutlined />}
        onClick={() => setIsOpen(true)}
        type="default"
      >
        Anular deuda
      </Button>

      <VoidDueModal
        onCancel={() => setIsOpen(false)}
        onConfirm={(reason) => {
          onConfirm(reason);
          setIsOpen(false);
        }}
        open={isOpen}
      />
    </>
  );
}
