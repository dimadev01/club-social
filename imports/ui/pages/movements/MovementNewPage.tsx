import { Breadcrumb, Card, Col, DatePicker, Flex, Form, Input } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';
import { Link } from 'react-router-dom';

import {
  MovementCategoryEnum,
  MovementTypeEnum,
  getMovementCategoryOptions,
  getMovementCategoryTypeOptions,
} from '@domain/categories/category.enum';
import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { ScopeEnum } from '@domain/roles/role.enum';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { FormButtons } from '@ui/components/Form/FormButtons';
import { FormInputAmount } from '@ui/components/Form/FormInputAmount';
import { Row } from '@ui/components/Layout/Row';
import { Select } from '@ui/components/Select';
import { useCreateMovement } from '@ui/hooks/movements/useCreateMovement';
import { useNotificationSuccess } from '@ui/hooks/ui/useNotification';

type FormValues = {
  amount: number;
  category: MovementCategoryEnum;
  date: Dayjs;
  notes?: string;
  type: MovementTypeEnum;
};

export const MovementNewPage = () => {
  const [form] = Form.useForm<FormValues>();

  const formCategoryType = useWatch(['type'], form);

  const notificationSuccess = useNotificationSuccess();

  const createMovement = useCreateMovement();

  const handleSubmit = async (values: FormValues) => {
    createMovement.mutate(
      {
        amount: Money.fromNumber(values.amount).amount,
        category: values.category,
        date: new DateTimeVo(values.date).format(DateFormatEnum.DATE),
        notes: values.notes || null,
        type: values.type,
      },
      {
        onSuccess: () => {
          notificationSuccess('Movimiento creado');

          form.setFieldsValue({
            amount: 0,
            category: undefined,
            notes: undefined,
          });
        },
      },
    );
  };

  return (
    <>
      <Breadcrumb
        className="mb-4"
        items={[
          { title: 'Inicio' },
          { title: <Link to="..">Movimientos</Link> },
          {
            title: 'Nuevo Movimiento',
          },
        ]}
      />

      <Card>
        <Form<FormValues>
          layout="vertical"
          form={form}
          onFinish={(values) => handleSubmit(values)}
          disabled={createMovement.isLoading}
          initialValues={{
            amount: 0,
            category: undefined,
            date: dayjs(),
            notes: undefined,
            type: MovementTypeEnum.EXPENSE,
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
                loading: createMovement.isLoading,
                text: 'Crear movimiento',
              }}
              scope={ScopeEnum.MOVEMENTS}
            />
          </Flex>
        </Form>
      </Card>
    </>
  );
};
