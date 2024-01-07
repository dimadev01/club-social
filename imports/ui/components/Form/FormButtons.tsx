import React from 'react';
import { Button } from 'antd';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { FormBackButton } from '@ui/components/Form/FormBackButton';
import { FormDeleteButton } from '@ui/components/Form/FormDeleteButton';
import { FormSaveButton } from '@ui/components/Form/FormSaveButton';

type Props = {
  isBackDisabled?: boolean;
  isDeleteDisabled?: boolean;
  isLoading?: boolean;
  isSaveDisabled?: boolean;
  onClickDelete?: () => void;
  scope: ScopeEnum;
  showBackButton?: boolean;
  showDeleteButton?: boolean;
};

export const FormButtons: React.FC<Props> = ({
  isLoading = false,
  showDeleteButton = false,
  onClickDelete,
  isBackDisabled,
  isDeleteDisabled,
  isSaveDisabled,
  showBackButton = true,
  scope,
}) => {
  const renderDeleteButton = () => {
    if (!showDeleteButton) {
      return false;
    }

    const user = Meteor.user();

    if (!user) {
      return null;
    }

    if (!Roles.userIsInRole(user, PermissionEnum.Delete, scope)) {
      return false;
    }

    return (
      <FormDeleteButton
        onClick={() => {
          if (onClickDelete) {
            onClickDelete();
          }
        }}
        disabled={isLoading || isDeleteDisabled}
      />
    );
  };

  const renderSaveButton = () => {
    const user = Meteor.user();

    if (!user) {
      return null;
    }

    if (
      !Roles.userIsInRole(user, PermissionEnum.Create, scope) &&
      !Roles.userIsInRole(user, PermissionEnum.Update, scope)
    ) {
      return false;
    }

    return <FormSaveButton loading={isLoading} disabled={isSaveDisabled} />;
  };

  const renderBackButton = () => {
    if (!showBackButton) {
      return false;
    }

    return <FormBackButton disabled={isLoading || isBackDisabled} />;
  };

  return (
    <div className="flex justify-between">
      <Button.Group>
        {renderSaveButton()}
        {renderBackButton()}
      </Button.Group>

      {renderDeleteButton()}
    </div>
  );
};
