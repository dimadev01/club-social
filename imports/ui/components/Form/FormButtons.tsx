import React from 'react';
import { Button } from 'antd';
import { FormBackButton } from '@ui/components/Form/FormBackButton';
import { FormDeleteButton } from '@ui/components/Form/FormDeleteButton';
import { FormSaveButton } from '@ui/components/Form/FormSaveButton';

type Props = {
  isDisabled?: boolean;
  isLoading?: boolean;
  onClickDelete?: () => void;
  showDeleteButton?: boolean;
};

export const FormButtons: React.FC<Props> = ({
  isLoading = false,
  showDeleteButton = false,
  isDisabled = false,
  onClickDelete,
}) => (
  <div className="flex justify-between">
    <Button.Group>
      <FormSaveButton loading={isLoading} disabled={isDisabled} />

      <FormBackButton disabled={isLoading || isDisabled} />
    </Button.Group>

    {showDeleteButton && (
      <FormDeleteButton
        onClick={() => {
          if (onClickDelete) {
            onClickDelete();
          }
        }}
        disabled={isLoading || isDisabled}
      />
    )}
  </div>
);
