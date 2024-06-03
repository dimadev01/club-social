import { Breadcrumb, Card, Descriptions, Flex, Space } from 'antd';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueStatusLabel } from '@domain/dues/due.enum';
import { ScopeEnum } from '@domain/roles/role.enum';
import { AppUrl } from '@ui/app.enum';
import { FormBackButton } from '@ui/components/Form/FormBackButton';
import { FormDeleteButton } from '@ui/components/Form/FormDeleteButton';
import { NotFound } from '@ui/components/NotFound';
import { useDeleteDue } from '@ui/hooks/dues/useDeleteDue';
import { useDue } from '@ui/hooks/dues/useDue';
import { useNavigate } from '@ui/hooks/useNavigate';
import { useNotificationSuccess } from '@ui/hooks/useNotification';

export const DueDetailPage = () => {
  const { id: dueId } = useParams<{ id?: string }>();

  const navigate = useNavigate();

  const notificationSuccess = useNotificationSuccess();

  const { data: due, error } = useDue(dueId ? { id: dueId } : undefined);

  const deleteDue = useDeleteDue();

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
          { title: <Link to={AppUrl.Dues}>Cobros</Link> },
          {
            title: `Cobro a ${due.member.name} del ${new DateUtcVo(due.date).format()}`,
          },
        ]}
      />

      <Card
        title={`Cobro a ${due.member.name} del ${new DateUtcVo(due.date).format()}`}
      >
        <>
          <Descriptions column={1} layout="vertical" colon={false}>
            <Descriptions.Item label="Fecha">
              {new DateUtcVo(due.date).format()}
            </Descriptions.Item>

            <Descriptions.Item label="Socio">
              {due.member.name}
            </Descriptions.Item>

            <Descriptions.Item label="Estado">
              <Space>
                {DueStatusLabel[due.status]}

                {due.paymentId && (
                  <Link to={`${AppUrl.Payments}/${due.paymentId}`}>
                    Ver pago
                  </Link>
                )}
              </Space>
            </Descriptions.Item>

            <Descriptions.Item label="Monto">
              {new Money({ amount: due.amount }).formatWithCurrency()}
            </Descriptions.Item>

            <Descriptions.Item label="Notas">{due.notes}</Descriptions.Item>
          </Descriptions>

          <Flex justify="space-between">
            <FormBackButton />

            <FormDeleteButton
              scope={ScopeEnum.DUES}
              onClick={() => {
                deleteDue.mutate(
                  { id: due.id },
                  {
                    onSuccess: () => {
                      notificationSuccess('Cobro eliminado');

                      navigate(AppUrl.Dues);
                    },
                  },
                );
              }}
            />
          </Flex>
        </>
      </Card>
    </>
  );
};
