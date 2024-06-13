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
import { Link, useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueStatusEnum, DueStatusLabel } from '@domain/dues/due.enum';
import { ScopeEnum } from '@domain/roles/role.enum';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { DuePaymentsGrid } from '@ui/components/Dues/DuePaymentsGrid';
import { FormBackButton } from '@ui/components/Form/FormBackButton';
import { FormEditButton } from '@ui/components/Form/FormEditButton';
import { FormVoidButton } from '@ui/components/Form/FormVoidButton';
import { NotFound } from '@ui/components/NotFound';
import { useDue } from '@ui/hooks/dues/useDue';
import { useVoidDue } from '@ui/hooks/dues/useVoidDue';
import { useNavigate } from '@ui/hooks/ui/useNavigate';
import { useNotificationSuccess } from '@ui/hooks/ui/useNotification';
import { renderDueCategoryLabel } from '@ui/utils/renderDueCategory';

export const DueDetailPage = () => {
  const { id: dueId } = useParams<{ id?: string }>();

  const navigate = useNavigate();

  const notificationSuccess = useNotificationSuccess();

  const { data: due, error } = useDue(dueId ? { id: dueId } : undefined);

  const voidDue = useVoidDue();

  if (error) {
    return <NotFound />;
  }

  if (!due) {
    return <Card loading />;
  }

  invariant(due.member);

  /**
   * Component
   */
  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[
          { title: 'Inicio' },
          { title: <Link to={AppUrl.DUES}>Deudas</Link> },
          {
            title: `Deuda de ${due.member.name} del ${new DateUtcVo(due.date).format()}`,
          },
        ]}
      />

      <Watermark
        content={
          due.status === DueStatusEnum.VOIDED
            ? DueStatusLabel[due.status]
            : undefined
        }
      >
        <Card
          title={`Deuda de ${due.member.name} del ${new DateUtcVo(due.date).format()}`}
        >
          <>
            <Descriptions column={1} layout="vertical" colon={false}>
              <Descriptions.Item label="Fecha de creación de deuda">
                {new DateVo(due.createdAt).format(DateFormatEnum.DDMMYYHHmm)}
              </Descriptions.Item>

              <Descriptions.Item label="Fecha de deuda del socio">
                {new DateUtcVo(due.date).format()}
              </Descriptions.Item>

              <Descriptions.Item label="Socio">
                {due.member.name}
              </Descriptions.Item>

              <Descriptions.Item label="Categoría">
                {renderDueCategoryLabel(due.category, due.date)}
              </Descriptions.Item>

              <Descriptions.Item label="Estado">
                {DueStatusLabel[due.status]}
              </Descriptions.Item>

              <Descriptions.Item label="Monto Original">
                {new Money({ amount: due.amount }).formatWithCurrency()}
              </Descriptions.Item>

              <Descriptions.Item label="Monto Pago">
                {new Money({
                  amount: due.totalPaidAmount,
                }).formatWithCurrency()}
              </Descriptions.Item>

              <Descriptions.Item label="Monto Pendiente">
                {new Money({
                  amount: due.totalPendingAmount,
                }).formatWithCurrency()}
              </Descriptions.Item>

              <Descriptions.Item label="Notas">{due.notes}</Descriptions.Item>

              {due.status === DueStatusEnum.VOIDED && (
                <>
                  <Descriptions.Item label="Anulado el">
                    {due.voidedAt
                      ? new DateVo(due.voidedAt).format(
                          DateFormatEnum.DDMMYYHHmm,
                        )
                      : ''}
                  </Descriptions.Item>

                  <Descriptions.Item label="Anulado por">
                    {due.voidedBy}
                  </Descriptions.Item>

                  <Descriptions.Item label="Motivo de anulación">
                    {due.voidReason}
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>

            <DuePaymentsGrid payments={due.payments} />

            <Divider />

            <Flex justify="space-between">
              <Space.Compact>
                <FormEditButton
                  scope={ScopeEnum.DUES}
                  disabled={due.status !== DueStatusEnum.PENDING}
                />
                <FormBackButton />
              </Space.Compact>

              <FormVoidButton
                disabled={due.status !== DueStatusEnum.PENDING}
                scope={ScopeEnum.DUES}
                onConfirm={(reason: string) => {
                  voidDue.mutate(
                    {
                      id: due.id,
                      voidReason: reason,
                    },
                    {
                      onSuccess: () => {
                        notificationSuccess('Deuda anulada');

                        navigate(AppUrl.DUES);
                      },
                    },
                  );
                }}
              />
            </Flex>
          </>
        </Card>
      </Watermark>
    </>
  );
};
