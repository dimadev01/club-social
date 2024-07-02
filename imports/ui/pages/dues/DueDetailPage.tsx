import { Card, Descriptions, Divider, Flex, Space, Watermark } from 'antd';
import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueStatusEnum, DueStatusLabel } from '@domain/dues/due.enum';
import { ScopeEnum } from '@domain/roles/role.enum';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { UrlUtils } from '@shared/utils/url.utils';
import { Breadcrumbs } from '@ui/components/Breadcrumbs/Breadcrumbs';
import { DueCategoryIconWithLabel } from '@ui/components/Dues/DueCategoryLabel';
import { DuePaymentsGrid } from '@ui/components/Dues/DuePaymentsGrid';
import { FormBackButton } from '@ui/components/Form/FormBackButton';
import { FormEditButton } from '@ui/components/Form/FormEditButton';
import { FormVoidButton } from '@ui/components/Form/FormVoidButton';
import { DuesIcon } from '@ui/components/Icons/DuesIcon';
import { NotFound } from '@ui/components/NotFound';
import { useDue } from '@ui/hooks/dues/useDue';
import { useVoidDue } from '@ui/hooks/dues/useVoidDue';
import { useNotificationSuccess } from '@ui/hooks/ui/useNotification';

export const DueDetailPage = () => {
  const { id: dueId } = useParams<{ id?: string }>();

  const navigate = useNavigate();

  const location = useLocation();

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
      <Breadcrumbs
        items={[
          {
            title: (
              <Space>
                <DuesIcon />
                <Link to={`..${UrlUtils.stringify(location.state)}`}>
                  Deudas
                </Link>
              </Space>
            ),
          },
          {
            title: `Deuda de ${due.member.name} del ${new DateVo(due.date).format()}`,
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
          extra={<DuesIcon />}
          title={`Deuda de ${due.member.name} del ${new DateVo(due.date).format()}`}
        >
          <>
            <Descriptions column={1} layout="vertical" colon={false}>
              <Descriptions.Item label="Fecha de creación de deuda">
                {new DateTimeVo(due.createdAt).format(
                  DateFormatEnum.DDMMYYHHmm,
                )}{' '}
                ({due.createdBy})
              </Descriptions.Item>

              <Descriptions.Item label="Fecha de deuda del socio">
                {new DateVo(due.date).format()}
              </Descriptions.Item>

              <Descriptions.Item label="Socio">
                {due.member.name}
              </Descriptions.Item>

              <Descriptions.Item label="Categoría">
                <DueCategoryIconWithLabel
                  category={due.category}
                  date={due.date}
                />
              </Descriptions.Item>

              <Descriptions.Item label="Estado">
                {DueStatusLabel[due.status]}
              </Descriptions.Item>

              <Descriptions.Item label="Monto Original">
                {Money.from({ amount: due.amount }).formatWithCurrency()}
              </Descriptions.Item>

              <Descriptions.Item label="Monto Pago">
                {Money.from({
                  amount: due.totalPaidAmount,
                }).formatWithCurrency()}
              </Descriptions.Item>

              <Descriptions.Item label="Monto Pendiente">
                {Money.from({
                  amount: due.totalPendingAmount,
                }).formatWithCurrency()}
              </Descriptions.Item>

              <Descriptions.Item label="Notas">{due.notes}</Descriptions.Item>

              {due.status === DueStatusEnum.VOIDED && (
                <>
                  <Descriptions.Item label="Anulado el">
                    {due.voidedAt
                      ? new DateTimeVo(due.voidedAt).format(
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

                        navigate(-1);
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
