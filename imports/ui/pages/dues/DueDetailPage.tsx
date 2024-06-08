import { Breadcrumb, Card, Descriptions, Divider, Flex, Space } from 'antd';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import {
  DueCategoryEnum,
  DueCategoryLabel,
  DueStatusEnum,
  DueStatusLabel,
} from '@domain/dues/due.enum';
import { ScopeEnum } from '@domain/roles/role.enum';
import { AppUrl } from '@ui/app.enum';
import { DuePaymentsGrid } from '@ui/components/Dues/DuePaymentsGrid';
import { FormBackButton } from '@ui/components/Form/FormBackButton';
import { FormVoidButton } from '@ui/components/Form/FormVoidButton';
import { NotFound } from '@ui/components/NotFound';
import { useDue } from '@ui/hooks/dues/useDue';
import { useVoidDue } from '@ui/hooks/dues/useVoidDue';
import { useNavigate } from '@ui/hooks/ui/useNavigate';
import { useNotificationSuccess } from '@ui/hooks/ui/useNotification';

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

            <Descriptions.Item label="Categoría">
              {due.category === DueCategoryEnum.MEMBERSHIP &&
                `${DueCategoryLabel[due.category]} (${new DateUtcVo(due.date).monthName()})`}

              {due.category !== DueCategoryEnum.MEMBERSHIP &&
                DueCategoryLabel[due.category]}
            </Descriptions.Item>

            <Descriptions.Item label="Estado">
              <Space>{DueStatusLabel[due.status]}</Space>
            </Descriptions.Item>

            <Descriptions.Item label="Monto">
              {new Money({ amount: due.amount }).formatWithCurrency()}
            </Descriptions.Item>

            <Descriptions.Item label="Notas">{due.notes}</Descriptions.Item>
          </Descriptions>

          <DuePaymentsGrid payments={due.payments} />

          <Divider />

          <Flex justify="space-between">
            <FormBackButton />

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
