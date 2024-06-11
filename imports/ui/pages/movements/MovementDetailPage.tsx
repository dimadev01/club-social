import { Breadcrumb, Card, Col, DatePicker, Flex, Form, Input } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import {
  MovementCategoryEnum,
  MovementStatusEnum,
  MovementTypeEnum,
  getMovementCategoryOptions,
  getMovementCategoryTypeOptions,
} from '@domain/categories/category.enum';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { ScopeEnum } from '@domain/roles/role.enum';
import { DateFormatEnum } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { FormButtons } from '@ui/components/Form/FormButtons';
import { FormInputAmount } from '@ui/components/Form/FormInputAmount';
import { FormVoidButton } from '@ui/components/Form/FormVoidButton';
import { Row } from '@ui/components/Layout/Row';
import { NotFound } from '@ui/components/NotFound';
import { Select } from '@ui/components/Select';
import { useCreateMovement } from '@ui/hooks/movements/useCreateMovement';
import { useMovement } from '@ui/hooks/movements/useMovement';
import { useUpdateMovement } from '@ui/hooks/movements/useUpdateMovement';
import { useVoidMovement } from '@ui/hooks/movements/useVoidMovement';
import { useNotificationSuccess } from '@ui/hooks/ui/useNotification';

type FormValues = {
  amount: number;
  category: MovementCategoryEnum;
  date: Dayjs;
  notes?: string;
  type: MovementTypeEnum;
};

export const MovementDetailPage = () => {
  const [form] = Form.useForm<FormValues>();

  const formCategoryType = useWatch(['type'], form);

  const { id } = useParams<{ id?: string }>();

  const navigate = useNavigate();

  const notificationSuccess = useNotificationSuccess();

  const { data: movement, fetchStatus: movementFetchStatus } = useMovement(
    id ? { id } : undefined,
  );

  const createMovement = useCreateMovement();

  const updateMovement = useUpdateMovement();

  const voidMovement = useVoidMovement();

  const handleSubmit = async (values: FormValues) => {
    if (!movement) {
      createMovement.mutate(
        {
          amount: Money.fromNumber(values.amount).value,
          category: values.category,
          date: new DateVo(values.date).format(DateFormatEnum.DATE),
          notes: values.notes ?? null,
          type: values.type,
        },
        {
          onSuccess: () => {
            notificationSuccess('Movimiento creado');

            navigate(-1);
          },
        },
      );
    } else {
      updateMovement.mutate(
        {
          amount: Money.fromNumber(values.amount).value,
          category: values.category,
          date: new DateVo(values.date).format(DateFormatEnum.DATE),
          id: movement.id,
          notes: values.notes ?? null,
          type: values.type,
        },
        {
          onSuccess: () => {
            notificationSuccess('Movimiento actualizado');

            navigate(-1);
          },
        },
      );
    }
  };

  const isLoading = movementFetchStatus === 'fetching';

  if (id && !movement && !isLoading) {
    return <NotFound />;
  }

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[
          { title: 'Inicio' },
          { title: <Link to={AppUrl.Movements}>Movimientos</Link> },
          {
            title: movement
              ? `Movimiento del ${new DateUtcVo(movement.date).format()} creado el ${new DateVo(movement.createdAt).format(DateFormatEnum.DDMMYYHHmm)}`
              : 'Nuevo Movimiento',
          },
        ]}
      />

      <Card loading={isLoading}>
        <Form<FormValues>
          layout="vertical"
          form={form}
          onFinish={(values) => handleSubmit(values)}
          disabled={
            createMovement.isLoading ||
            movement?.status === MovementStatusEnum.VOIDED ||
            !!movement?.paymentId
          }
          initialValues={{
            amount: movement
              ? new Money({ amount: movement.amount }).toInteger()
              : 0,
            category: movement?.category,
            date: movement ? dayjs.utc(movement.date) : undefined,
            notes: movement?.notes,
            type: movement?.type ?? MovementTypeEnum.INCOME,
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
                text: movement ? 'Actualizar movimiento' : 'Crear movimiento',
              }}
              scope={ScopeEnum.MOVEMENTS}
            />

            {movement && (
              <FormVoidButton
                scope={ScopeEnum.MOVEMENTS}
                onConfirm={(reason: string) => {
                  invariant(movement);

                  voidMovement.mutate(
                    {
                      id: movement.id,
                      voidReason: reason,
                    },
                    {
                      onSuccess: () => {
                        notificationSuccess('Movimiento anulado');

                        navigate(AppUrl.Movements);
                      },
                    },
                  );
                }}
              />
            )}
          </Flex>
        </Form>
      </Card>
    </>
  );
};
