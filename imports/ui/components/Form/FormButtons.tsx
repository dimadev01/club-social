import React from 'react';
import { Button, Flex } from 'antd';
import { ScopeEnum } from '@domain/roles/role.enum';
import {
  FormBackButton,
  type FormBackButtonProps,
} from '@ui/components/Form/FormBackButton';
import {
  FormSaveButton,
  type FormSaveButtonProps,
} from '@ui/components/Form/FormSaveButton';

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
