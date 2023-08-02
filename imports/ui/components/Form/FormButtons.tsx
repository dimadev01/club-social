import React from 'react';
import { FormBackButton } from '@ui/components/Form/FormBackButton';
import { FormSaveButton } from '@ui/components/Form/FormSaveButton';

type Props = {
  isLoading?: boolean;
};

export const FormButtons: React.FC<Props> = ({ isLoading = false }) => (
  <div className="flex justify-between">
    <FormBackButton disabled={isLoading} />

    <FormSaveButton loading={isLoading} disabled={isLoading} />
  </div>
);
