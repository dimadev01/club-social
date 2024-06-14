import {
  Breadcrumb,
  Card,
  Descriptions,
  Divider,
  Flex,
  Space,
  Watermark,
} from 'antd';
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  MovementCategoryLabel,
  MovementStatusLabel,
  MovementTypeLabel,
} from '@domain/categories/category.enum';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { ScopeEnum } from '@domain/roles/role.enum';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { FormBackButton } from '@ui/components/Form/FormBackButton';
import { FormEditButton } from '@ui/components/Form/FormEditButton';
import { FormVoidButton } from '@ui/components/Form/FormVoidButton';
import { NotFound } from '@ui/components/NotFound';
import { useMovement } from '@ui/hooks/movements/useMovement';
import { useVoidMovement } from '@ui/hooks/movements/useVoidMovement';
import { useNotificationSuccess } from '@ui/hooks/ui/useNotification';

export const MovementDetailPage = () => {
  const { id } = useParams<{ id?: string }>();

  const navigate = useNavigate();

  const notificationSuccess = useNotificationSuccess();

  const { data: movement, error } = useMovement(id ? { id } : undefined);

  const voidMovement = useVoidMovement();

  if (error) {
    return <NotFound />;
  }

  if (!movement) {
    return <Card loading />;
  }

  return (
    <>
      <Breadcrumb
        className="mb-4"
        items={[
          { title: 'Inicio' },
          { title: <Link to={AppUrl.MOVEMENTS}>Movimientos</Link> },
          {
            title: `Movimiento del ${new DateUtcVo(movement.date).format()} creado el ${new DateVo(movement.createdAt).format(DateFormatEnum.DDMMYYHHmm)}`,
          },
        ]}
      />

      <Watermark
        content={
          movement.isVoided ? MovementStatusLabel[movement.status] : undefined
        }
      >
        <Card
          title={`Movimiento del ${new DateUtcVo(movement.date).format()} creado el ${new DateVo(movement.createdAt).format(DateFormatEnum.DDMMYYHHmm)}`}
        >
          <Descriptions column={1} layout="vertical" colon={false}>
            <Descriptions.Item label="Fecha">
              {new DateUtcVo(movement.date).format()}
            </Descriptions.Item>

            <Descriptions.Item label="Tipo">
              {MovementTypeLabel[movement.type]}
            </Descriptions.Item>

            <Descriptions.Item label="Categoría">
              {MovementCategoryLabel[movement.category]}
            </Descriptions.Item>

            <Descriptions.Item label="Monto">
              {new Money({ amount: movement.amount }).formatWithCurrency()}
            </Descriptions.Item>

            <Descriptions.Item label="Notas">
              {movement.notes}
            </Descriptions.Item>

            {movement.isVoided && (
              <>
                <Descriptions.Item label="Anulado el">
                  {movement.voidedAt
                    ? new DateVo(movement.voidedAt).format(
                        DateFormatEnum.DDMMYYHHmm,
                      )
                    : ''}
                </Descriptions.Item>

                <Descriptions.Item label="Anulado por">
                  {movement.voidedBy}
                </Descriptions.Item>

                <Descriptions.Item label="Motivo de anulación">
                  {movement.voidReason}
                </Descriptions.Item>
              </>
            )}
          </Descriptions>

          <Divider />

          <Flex justify="space-between">
            <Space.Compact>
              <FormEditButton
                scope={ScopeEnum.MOVEMENTS}
                disabled={!movement.isUpdatable}
              />
              <FormBackButton />
            </Space.Compact>

            <FormVoidButton
              disabled={!movement.isVoidable}
              scope={ScopeEnum.MOVEMENTS}
              onConfirm={(reason: string) => {
                voidMovement.mutate(
                  {
                    id: movement.id,
                    voidReason: reason,
                  },
                  {
                    onSuccess: () => {
                      notificationSuccess('Movimiento anulado');

                      navigate(AppUrl.MOVEMENTS);
                    },
                  },
                );
              }}
            />
          </Flex>
        </Card>
      </Watermark>
    </>
  );
};
