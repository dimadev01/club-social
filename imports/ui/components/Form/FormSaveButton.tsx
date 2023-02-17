import React from 'react';
import { Button } from '@ui/components/Button';

type Props = {
  isLoading?: boolean;
};

export const FormSaveButton: React.FC<Props> = ({ isLoading = false }) => (
  <Button
    type="primary"
    disabled={isLoading}
    loading={isLoading}
    htmlType="submit"
  >
    Guardar
  </Button>
);
