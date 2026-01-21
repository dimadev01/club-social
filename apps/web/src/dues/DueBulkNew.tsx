import type {
  CreateDueDto,
  PreviewBulkDuesResultDto,
} from '@club-social/shared/dues';
import type { ParamIdDto } from '@club-social/shared/types';

import { DueCategory } from '@club-social/shared/dues';
import { DateFormat } from '@club-social/shared/lib';
import { App } from 'antd';
import { useNavigate } from 'react-router';

import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { Card, FormSubmitButton, NotFound } from '@/ui';
import { usePermissions } from '@/users/use-permissions';

import { DueBulkForm, type DueBulkFormData } from './DueBulkForm';

export function DueBulkNew() {
  const { message } = App.useApp();
  const permissions = usePermissions();
  const navigate = useNavigate();

  const createDueMutation = useMutation<ParamIdDto, Error, CreateDueDto>({
    mutationFn: (body) => $fetch('/dues', { body }),
  });

  const handleBulkSubmit = async (
    values: DueBulkFormData,
    preview: PreviewBulkDuesResultDto,
  ) => {
    const date = DateFormat.isoDate(values.date.startOf('month'));

    const results = await Promise.allSettled(
      preview.members.map((member) =>
        createDueMutation.mutateAsync({
          amount: member.amount,
          category: DueCategory.MEMBERSHIP,
          date,
          memberId: member.memberId,
          notes: values.notes || null,
        }),
      ),
    );

    const successfulResults = results.filter(
      (result) => result.status === 'fulfilled',
    );
    const failedResults = results.filter(
      (result) => result.status === 'rejected',
    );

    if (failedResults.length > 0) {
      message.error(
        `${successfulResults.length} deudas creadas exitosamente, ${failedResults.length} fallaron`,
      );

      return;
    }

    message.success(`${successfulResults.length} deudas creadas exitosamente`);
    navigate('/dues');
  };

  if (!permissions.dues.create) {
    return <NotFound />;
  }

  const isMutating = createDueMutation.isPending;

  return (
    <Card
      actions={[
        <FormSubmitButton disabled={isMutating} loading={isMutating}>
          Crear cuotas mensuales
        </FormSubmitButton>,
      ]}
      backButton
      title="Crear cuotas mensuales"
    >
      <DueBulkForm disabled={isMutating} onSubmit={handleBulkSubmit} />
    </Card>
  );
}
