import {
  type IVoidMovementDto,
  MovementCategoryLabel,
  MovementStatus,
  MovementStatusLabel,
  MovementTypeLabel,
} from '@club-social/shared/movements';
import { App, Button, Descriptions, Divider, Grid } from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useMutation } from '@/shared/hooks/useMutation';
import { DateFormat } from '@/shared/lib/date-format';
import { $fetch } from '@/shared/lib/fetch';
import { NumberFormat } from '@/shared/lib/number-format';
import { Card } from '@/ui/Card';
import { NotFound } from '@/ui/NotFound';
import { VoidModal } from '@/ui/VoidModal';
import { usePermissions } from '@/users/use-permissions';

import { useMovement } from './useMovement';

export function MovementView() {
  const permissions = usePermissions();
  const { message } = App.useApp();
  const { id } = useParams();
  const { md } = Grid.useBreakpoint();
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
    <Card
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
        bordered
        column={md ? 2 : 1}
        layout={md ? 'horizontal' : 'vertical'}
      >
        <Descriptions.Item label="Fecha">
          {DateFormat.date(movement.date)}
        </Descriptions.Item>
        <Descriptions.Item label="Tipo">
          {MovementTypeLabel[movement.type]}
        </Descriptions.Item>
        <Descriptions.Item label="Categoría">
          {MovementCategoryLabel[movement.category]}
        </Descriptions.Item>
        <Descriptions.Item label="Monto">
          {NumberFormat.formatCents(movement.amount)}
        </Descriptions.Item>
        <Descriptions.Item label="Estado" span="filled">
          {MovementStatusLabel[movement.status]}
        </Descriptions.Item>
        <Descriptions.Item label="Descripción" span="filled">
          {movement.description ?? '-'}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Descriptions
        column={md ? 2 : 1}
        layout={md ? 'horizontal' : 'vertical'}
        size="small"
      >
        <Descriptions.Item label="Creado por">
          {movement.createdBy}
        </Descriptions.Item>
        <Descriptions.Item label="Creado el">
          {DateFormat.dateTime(movement.createdAt)}
        </Descriptions.Item>
        <Descriptions.Item label="Actualizado por">
          {movement.updatedBy}
        </Descriptions.Item>
        <Descriptions.Item label="Actualizado el">
          {DateFormat.dateTime(movement.updatedAt)}
        </Descriptions.Item>
        <Descriptions.Item label="Anulado por">
          {movement.voidedBy ?? '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Anulado el">
          {movement.voidedAt ? DateFormat.dateTime(movement.voidedAt) : '-'}
        </Descriptions.Item>
        {movement.voidReason && (
          <Descriptions.Item label="Razón de anulación" span={2}>
            {movement.voidReason}
          </Descriptions.Item>
        )}
      </Descriptions>

      <VoidModal
        onCancel={() => setIsVoidModalOpen(false)}
        onConfirm={(reason) => {
          voidMovementMutation.mutate({ voidReason: reason });
          setIsVoidModalOpen(false);
        }}
        open={isVoidModalOpen}
      />
    </Card>
  );
}
