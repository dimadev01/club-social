import React from 'react';
import { Button } from 'antd';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { FormBackButton } from '@ui/components/Form/FormBackButton';
import { FormDeleteButton } from '@ui/components/Form/FormDeleteButton';
import { FormSaveButton } from '@ui/components/Form/FormSaveButton';

type Props = {
  createScope?: ScopeEnum;
  deleteScope?: ScopeEnum;
  isDisabled?: boolean;
  isLoading?: boolean;
  onClickDelete?: () => void;
  showDeleteButton?: boolean;
  updateScope?: ScopeEnum;
};

export const FormButtons: React.FC<Props> = ({
  isLoading = false,
  showDeleteButton = false,
  isDisabled = false,
  onClickDelete,
  deleteScope,
  createScope,
  updateScope,
}) => {
  const renderDeleteButton = () => {
    if (!showDeleteButton) {
      return false;
    }

    const user = Meteor.user();

    if (!user) {
      return null;
    }

    if (
      deleteScope &&
      !Roles.userIsInRole(user, PermissionEnum.Delete, deleteScope)
    ) {
      return false;
    }

    return (
      <FormDeleteButton
        onClick={() => {
          if (onClickDelete) {
            onClickDelete();
          }
        }}
        disabled={isLoading || isDisabled}
      />
    );
  };

  const renderSaveButton = () => {
    const user = Meteor.user();

    if (!user) {
      return null;
    }

    if (
      createScope &&
      !Roles.userIsInRole(user, PermissionEnum.Create, createScope)
    ) {
      return false;
    }

    if (
      updateScope &&
      !Roles.userIsInRole(user, PermissionEnum.Create, updateScope)
    ) {
      return false;
    }

    return <FormSaveButton loading={isLoading} disabled={isDisabled} />;
  };

  return (
    <div className="flex justify-between">
      <Button.Group>
        {renderSaveButton()}

        <FormBackButton disabled={isLoading || isDisabled} />
      </Button.Group>

      {renderDeleteButton()}
    </div>
  );
};
