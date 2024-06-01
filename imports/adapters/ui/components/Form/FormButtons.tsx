import { Button, Flex } from 'antd';
import React from 'react';

import {
  FormBackButton,
  type FormBackButtonProps,
} from '@adapters/ui/components/Form/FormBackButton';
import {
  FormSaveButton,
  type FormSaveButtonProps,
} from '@adapters/ui/components/Form/FormSaveButton';
import { ScopeEnum } from '@domain/roles/role.enum';

type Props = {
  backButtonProps?: FormBackButtonProps;
  saveButtonProps?: FormSaveButtonProps;
  scope: ScopeEnum;
};

export const FormButtons: React.FC<Props> = ({
  saveButtonProps,
  backButtonProps,
  scope,
}) => (
  <Flex justify="space-between">
    <Button.Group>
      <FormSaveButton scope={scope} {...saveButtonProps} />
      <FormBackButton {...backButtonProps} />
    </Button.Group>
  </Flex>
);
