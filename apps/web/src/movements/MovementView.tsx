import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import {
  MovementCategoryLabel,
  MovementMode,
  MovementModeLabel,
  MovementStatus,
  MovementStatusLabel,
  type VoidMovementDto,
} from '@club-social/shared/movements';
import { usePostHog } from '@posthog/react';
import { Button, Col } from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useVoidMutation } from '@/shared/hooks/useVoidMutation';
import { PostHogEvent } from '@/shared/lib/posthog-events';
import {
  Card,
  Descriptions,
  DescriptionsAudit,
  NavigateToPayment,
  NotFound,
  Row,
  VoidModal,
} from '@/ui';
import { usePermissions } from '@/users/use-permissions';

import { useMovement } from './useMovement';

export function MovementView() {
  const posthog = usePostHog();
  const permissions = usePermissions();
  const { id } = useParams();
  const navigate = useNavigate();

  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);

  const { data: movement, isLoading } = useMovement(id);

  const voidMovementMutation = useVoidMutation<unknown, Error, VoidMovementDto>(
    {
      endpoint: `movements/${id}/void`,
      onSuccess: () => {
        posthog.capture(PostHogEvent.MOVEMENT_VOIDED);
        navigate(-1);
      },
      successMessage: 'Entrada/Salida anulada correctamente',
    },
  );

  if (isLoading) {
    return <Card loading />;
  }

  if (!movement) {
    return <NotFound />;
  }

  const isMutating = voidMovementMutation.isPending;
  const canVoid =
    permissions.movements.void &&
    movement.status === MovementStatus.REGISTERED &&
    movement.mode === MovementMode.MANUAL;

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
      <Row>
        <Col md={12} xs={24}>
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
                children: NumberFormat.currencyCents(movement.amount, {
                  maximumFractionDigits: 2,
                }),
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
                children: movement.paymentId ? (
                  <NavigateToPayment formatDate={false} id={movement.paymentId}>
                    Ver pago
                  </NavigateToPayment>
                ) : (
                  '-'
                ),
                label: 'Pago',
              },
              {
                children: movement.notes ?? '-',
                label: 'Notas',
              },
            ]}
          />
        </Col>
        <Col md={12} xs={24}>
          <DescriptionsAudit {...movement} />
        </Col>
      </Row>

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
