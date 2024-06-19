import { Breadcrumb, Card, Col, DatePicker, Flex, Form, Input } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import {
  MovementCategoryEnum,
  MovementTypeEnum,
  getMovementCategoryOptions,
  getMovementCategoryTypeOptions,
} from '@domain/categories/category.enum';
import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { ScopeEnum } from '@domain/roles/role.enum';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { FormButtons } from '@ui/components/Form/FormButtons';
import { FormInputAmount } from '@ui/components/Form/FormInputAmount';
import { Row } from '@ui/components/Layout/Row';
import { NotFound } from '@ui/components/NotFound';
import { Select } from '@ui/components/Select';
import { useMovement } from '@ui/hooks/movements/useMovement';
import { useUpdateMovement } from '@ui/hooks/movements/useUpdateMovement';
import { useNotificationSuccess } from '@ui/hooks/ui/useNotification';

type FormValues = {
  amount: number;
  category: MovementCategoryEnum;
  date: Dayjs;
  notes?: string;
  type: MovementTypeEnum;
};

export const MovementEditPage = () => {
  const [form] = Form.useForm<FormValues>();

  const formCategoryType = useWatch(['type'], form);

  const { id } = useParams<{ id?: string }>();

  const navigate = useNavigate();

  const notificationSuccess = useNotificationSuccess();

  const { data: movement, error } = useMovement(id ? { id } : undefined);

  const updateMovement = useUpdateMovement();

  const handleSubmit = async (values: FormValues) => {
    invariant(movement);

    updateMovement.mutate(
      {
        amount: Money.fromNumber(values.amount).amount,
        category: values.category,
        date: new DateTimeVo(values.date).format(DateFormatEnum.DATE),
        id: movement.id,
        notes: values.notes || null,
        type: values.type,
      },
      {
        onSuccess: () => {
          notificationSuccess('Movimiento actualizado');

          navigate(-1);
        },
      },
    );
  };

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
            title: `Movimiento del ${new DateVo(movement.date).format()} creado el ${new DateTimeVo(movement.createdAt).format(DateFormatEnum.DDMMYYHHmm)}`,
          },
        ]}
      />

      <Card
        title={`Movimiento del ${new DateVo(movement.date).format()} creado el ${new DateTimeVo(movement.createdAt).format(DateFormatEnum.DDMMYYHHmm)}`}
      >
        <Form<FormValues>
          layout="vertical"
          form={form}
          onFinish={(values) => handleSubmit(values)}
          disabled={updateMovement.isLoading}
          initialValues={{
            amount: new Money({ amount: movement.amount }).toInteger(),
            category: movement.category,
            date: dayjs.utc(movement.date),
            notes: movement.notes,
            type: movement.type,
          }}
        >
          <Row>
            <Col xs={12} sm={8} md={8} lg={6} xl={4}>
              <Form.Item
                name="date"
                label="Fecha"
                rules={[{ required: true }, { type: 'date' }]}
              >
                <DatePicker
                  format={DateFormatEnum.DDMMYYYY}
                  className="w-full"
                  disabledDate={(current) => current.isAfter(dayjs())}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xs={12} sm={8} md={8} lg={6} xl={4} />
          </Row>

          <Row>
            <Col xs={12} sm={8} md={8} lg={6} xl={4}>
              <Form.Item label="Tipo" name="type" rules={[{ required: true }]}>
                <Select
                  showSearch={false}
                  onChange={() => {
                    form.setFieldValue('category', undefined);

                    form.setFieldValue('amount', 0);
                  }}
                  options={getMovementCategoryTypeOptions()}
                />
              </Form.Item>
            </Col>
          </Row>

          {formCategoryType && (
            <Row>
              <Col xs={12} sm={8} md={8} lg={6} xl={4}>
                <Form.Item
                  label="Categoría"
                  name="category"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={getMovementCategoryOptions(formCategoryType)}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

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

          <Flex justify="space-between">
            <FormButtons
              saveButtonProps={{
                loading: updateMovement.isLoading,
                text: 'Actualizar movimiento',
              }}
              scope={ScopeEnum.MOVEMENTS}
            />
          </Flex>
        </Form>
      </Card>
    </>
  );
};
