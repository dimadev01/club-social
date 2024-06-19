import { Card, Col, Descriptions, Form, Input, Space } from 'antd';
import { Dayjs } from 'dayjs';
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import {
  DueCategoryEnum,
  DueCategoryLabel,
  DueStatusLabel,
} from '@domain/dues/due.enum';
import { ScopeEnum } from '@domain/roles/role.enum';
import { AppUrl } from '@ui/app.enum';
import { Breadcrumbs } from '@ui/components/Breadcrumbs/Breadcrumbs';
import { FormButtons } from '@ui/components/Form/FormButtons';
import { FormInputAmount } from '@ui/components/Form/FormInputAmount';
import { DuesIcon } from '@ui/components/Icons/DuesIcon';
import { Row } from '@ui/components/Layout/Row';
import { NotFound } from '@ui/components/NotFound';
import { useDue } from '@ui/hooks/dues/useDue';
import { useUpdateDue } from '@ui/hooks/dues/useUpdateDue';
import { useNotificationSuccess } from '@ui/hooks/ui/useNotification';

type FormValues = {
  amount: number;
  category: DueCategoryEnum;
  date: Dayjs;
  memberIds: string[] | undefined;
  notes: string | undefined;
};

export const DueEditPage = () => {
  const { id: dueId } = useParams<{ id?: string }>();

  const navigate = useNavigate();

  const { data: due, error } = useDue(dueId ? { id: dueId } : undefined);

  const notificationSuccess = useNotificationSuccess();

  const updateDue = useUpdateDue();

  const handleSubmit = async (values: FormValues) => {
    invariant(due);

    updateDue.mutate(
      {
        amount: Money.fromNumber(values.amount).amount,
        id: due.id,
        notes: values.notes || null,
      },
      {
        onSuccess: () => {
          notificationSuccess('Deuda actualizada');

          navigate(-1);
        },
      },
    );
  };

  if (error) {
    return <NotFound />;
  }

  if (!due) {
    return <Card loading />;
  }

  invariant(due.member);

  return (
    <>
      <Breadcrumbs
        items={[
          {
            title: (
              <Space>
                <DuesIcon />
                <Link to={`/${AppUrl.DUES}`}>Deudas</Link>
              </Space>
            ),
          },
          {
            title: `Editando deuda de ${due.member.name} del ${new DateVo(due.date).format()}`,
          },
        ]}
      />

      <Card
        extra={<DuesIcon />}
        title={`Editando deuda de ${due.member.name} del ${new DateVo(due.date).format()}`}
      >
        <Form<FormValues>
          layout="vertical"
          disabled={updateDue.isLoading}
          onFinish={(values) => handleSubmit(values)}
          initialValues={{
            amount: new Money({ amount: due.amount }).toInteger(),
            notes: due.notes,
          }}
        >
          <Descriptions column={1} layout="vertical" colon={false}>
            <Descriptions.Item label="Fecha">
              {new DateVo(due.date).format()}
            </Descriptions.Item>

            <Descriptions.Item label="Socio">
              {due.member.name}
            </Descriptions.Item>

            <Descriptions.Item label="Categoría">
              {due.category === DueCategoryEnum.MEMBERSHIP &&
                `${DueCategoryLabel[due.category]} (${new DateVo(due.date).monthName()})`}

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

          <Row>
            <Col xs={12} sm={8} md={8} lg={6} xl={4}>
              <Form.Item
                label="Importe"
                name="amount"
                rules={[{ required: true }, { min: 1, type: 'number' }]}
              >
                <FormInputAmount />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Notas" rules={[{ whitespace: true }]} name="notes">
            <Input.TextArea rows={1} />
          </Form.Item>

          <FormButtons
            saveButtonProps={{
              disabled: updateDue.isLoading,
              text: 'Actualizar deuda',
            }}
            scope={ScopeEnum.DUES}
          />
        </Form>
      </Card>
    </>
  );
};
