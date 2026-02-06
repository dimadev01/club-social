import type {
  CreateDueDto,
  PreviewBulkDuesResultDto,
} from '@club-social/shared/dues';
import type { ParamIdDto } from '@club-social/shared/types';

import { DueCategory, DueCreationMode } from '@club-social/shared/dues';
import { DateFormat } from '@club-social/shared/lib';
import { usePostHog } from '@posthog/react';
import { App, Typography } from 'antd';
import { useNavigate } from 'react-router';

import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { PostHogEvent } from '@/shared/lib/posthog-events';
import { Card, FormSubmitButton, NotFound } from '@/ui';
import { usePermissions } from '@/users/use-permissions';

import { DueBulkForm, type DueBulkFormData } from './DueBulkForm';

export function DueBulkNew() {
  const { message, modal } = App.useApp();
  const posthog = usePostHog();
  const permissions = usePermissions();
  const navigate = useNavigate();

  const createDueMutation = useMutation<ParamIdDto, Error, CreateDueDto>({
    mutationFn: (body) => $fetch('/dues', { body }),
  });

  const handleBulkSubmit = async (
    values: DueBulkFormData,
    preview: PreviewBulkDuesResultDto,
  ) => {
    if (preview.members.length === 0) {
      message.error(
        'Debe seleccionar al menos un socio para crear cuotas mensuales',
      );

      return;
    }

    modal.confirm({
      content: (
        <>
          <Typography.Paragraph>
            Se crearán {preview.members.length} cuotas mensuales en el sistema
            para los socios seleccionados.
          </Typography.Paragraph>
          <Typography.Paragraph>
            Este proceso envía solo notificaciones a los socios.
          </Typography.Paragraph>
        </>
      ),
      onOk: async () => {
        const date = DateFormat.isoDate(values.date.startOf('month'));

        const results = await Promise.allSettled(
          preview.members.map((member) =>
            createDueMutation.mutateAsync({
              amount: member.amount,
              category: DueCategory.MEMBERSHIP,
              creationMode: DueCreationMode.BULK,
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

        posthog.capture(PostHogEvent.DUE_BULK_CREATED, {
          creation_mode: DueCreationMode.BULK,
          members_count: successfulResults.length,
        });

        message.success(
          `${successfulResults.length} deudas creadas exitosamente`,
        );
        navigate('/dues');
      },
      title: 'Confirmación de creación de cuotas mensuales',
    });
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
