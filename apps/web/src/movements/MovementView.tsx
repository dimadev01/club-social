import { NumberFormat } from '@club-social/shared/lib';
import { DateFormat } from '@club-social/shared/lib';
import {
  type IVoidMovementDto,
  MovementCategoryLabel,
  MovementModeLabel,
  MovementStatus,
  MovementStatusLabel,
  MovementTypeLabel,
} from '@club-social/shared/movements';
import { App, Button, Divider } from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { Card } from '@/ui/Card';
import { Descriptions } from '@/ui/Descriptions';
import { DescriptionsAudit } from '@/ui/DescriptionsAudit';
import { NotFound } from '@/ui/NotFound';
import { Page } from '@/ui/Page';
import { VoidModal } from '@/ui/VoidModal';
import { usePermissions } from '@/users/use-permissions';

import { useMovement } from './useMovement';

export function MovementView() {
  const permissions = usePermissions();
  const { message } = App.useApp();
  const { id } = useParams();
  const navigate = useNavigate();

  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);

  const { data: movement, isLoading } = useMovement(id);

  const voidMovementMutation = useMutation<unknown, Error, IVoidMovementDto>({
    mutationFn: (body) =>
      $fetch(`movements/${id}/void`, { body, method: 'PATCH' }),
    onSuccess: () => {
      message.success('Entrada/Salida anulada correctamente');
      navigate(-1);
    },
  });

  if (isLoading) {
    return <Card loading />;
  }

  if (!movement) {
    return <NotFound />;
  }

  const isMutating = voidMovementMutation.isPending;
  const canVoid =
    permissions.movements.void && movement.status === MovementStatus.REGISTERED;

  return (
    <Page
      actions={[
        canVoid && (
          <Button
            danger
            disabled={isMutating}
            onClick={() => setIsVoidModalOpen(true)}
            type="primary"
          >
            Anular movimiento
          </Button>
        ),
      ].filter(Boolean)}
      backButton
      title="Detalle de movimiento"
    >
      <Descriptions
        items={[
          {
            children: DateFormat.date(movement.date),
            label: 'Fecha',
          },
          {
            children: MovementCategoryLabel[movement.category],
            label: 'Categoría',
          },
          {
            children: MovementTypeLabel[movement.type],
            label: 'Tipo',
          },
          {
            children: NumberFormat.formatCurrencyCents(movement.amount),
            label: 'Monto',
          },
          {
            children: MovementStatusLabel[movement.status],
            label: 'Estado',
          },
          {
            children: MovementModeLabel[movement.mode],
            label: 'Modo',
          },
          {
            children: movement.notes ?? '-',
            label: 'Notas',
          },
        ]}
      />
      <Divider />

      <DescriptionsAudit {...movement} />

      <VoidModal
        onCancel={() => setIsVoidModalOpen(false)}
        onConfirm={(reason) => {
          voidMovementMutation.mutate({ voidReason: reason });
          setIsVoidModalOpen(false);
        }}
        open={isVoidModalOpen}
      />
    </Page>
  );
}
