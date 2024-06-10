import { Flex, Space } from 'antd';
import React from 'react';

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
    <Space.Compact>
      <FormSaveButton scope={scope} {...saveButtonProps} />
      <FormBackButton {...backButtonProps} />
    </Space.Compact>
  </Flex>
);
