import React from 'react';
import { Button } from 'antd';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { FormBackButton } from '@ui/components/Form/FormBackButton';
import { FormDeleteButton } from '@ui/components/Form/FormDeleteButton';
import { FormSaveButton } from '@ui/components/Form/FormSaveButton';

type Props = {
  isDisabled?: boolean;
  isLoading?: boolean;
  onClickDelete?: () => void;
  scope: ScopeEnum;
  showDeleteButton?: boolean;
};

export const FormButtons: React.FC<Props> = ({
  isLoading = false,
  showDeleteButton = false,
  isDisabled = false,
  onClickDelete,
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
      !Roles.userIsInRole(user, PermissionEnum.Create, scope) &&
      !Roles.userIsInRole(user, PermissionEnum.Update, scope)
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
