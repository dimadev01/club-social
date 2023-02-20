import React from 'react';
import {
  Breadcrumb,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Spin,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import {
  getMovementCategoryOptions,
  MovementCategory,
} from '@domain/movements/movements.enum';
import { DateFormats, DateUtils } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { NotFound } from '@ui/components/NotFound';
import { Select } from '@ui/components/Select';
import { useCreateMovement } from '@ui/hooks/movements/useCreateMovement';
import { useMovement } from '@ui/hooks/movements/useMovement';

type FormValues = {
  amount: number;
  category: MovementCategory;
  date: Dayjs;
  notes: string;
};

export const MovementsDetailPage = () => {
  const [form] = Form.useForm<FormValues>();

  const { id } = useParams<{ id?: string }>();

  const navigate = useNavigate();

  const { data: movement, fetchStatus: movementFetchStatus } = useMovement(id);

  const createMovement = useCreateMovement();

  // const updateMember = useUpdateMember();

  const handleSubmit = async (values: FormValues) => {
    if (!movement) {
      const memberId = await createMovement.mutateAsync({
        amount: values.amount,
        category: values.category,
        date: DateUtils.format(values.date),
        notes: values.notes,
      });

      message.success('Socio creado');

      navigate(`${AppUrl.Members}/${memberId}`);
    } else {
      // await updateMember.mutateAsync({
      //   addressCityGovId: values.address.cityGovId?.value ?? null,
      //   addressCityName: values.address.cityGovId?.label ?? null,
      //   addressStateGovId: values.address.stateGovId?.value ?? null,
      //   addressStateName: values.address.stateGovId?.label ?? null,
      //   addressStreet: values.address.street ?? null,
      //   addressZipCode: values.address.zipCode ?? null,
      //   category: values.category ?? null,
      //   dateOfBirth: values.dateOfBirth
      //     ? DateUtils.format(values.dateOfBirth)
      //     : null,
      //   documentID: values.documentID ?? null,
      //   emails: compact(values.emails).length > 0 ? values.emails : null,
      //   fileStatus: values.fileStatus ?? null,
      //   firstName: values.firstName,
      //   id: movement._id,
      //   lastName: values.lastName,
      //   maritalStatus: values.maritalStatus ?? null,
      //   nationality: values.nationality ?? null,
      //   phones: compact(values.phones).length > 0 ? values.phones : null,
      //   role: Role.Member,
      //   sex: values.sex ?? null,
      //   status: values.status,
      // });
      // message.success('Socio actualizado');
    }
  };

  if (movementFetchStatus === 'fetching') {
    return <Spin spinning />;
  }

  if (id && !movement) {
    return <NotFound />;
  }

  return (
    <>
      <Breadcrumb className="mb-8">
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to={AppUrl.Movements}>Movimientos</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {!!movement && movement.date}
          {!movement && 'Nuevo Movimiento'}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card>
        <Form<FormValues>
          layout="vertical"
          form={form}
          onFinish={(values) => handleSubmit(values)}
          initialValues={{
            amount: movement?.amount ?? 0,
            category: movement?.category ?? MovementCategory.Membership,
            date: movement?.date ? dayjs(movement.date) : dayjs(),
            notes: movement?.notes,
          }}
        >
          <Form.Item
            name="date"
            label="Fecha"
            rules={[{ required: true }, { type: 'date' }]}
          >
            <DatePicker
              autoFocus
              format={DateFormats.DD_MM_YYYY}
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            label="Categoría"
            name="category"
            rules={[{ required: true }]}
          >
            <Select options={getMovementCategoryOptions()} />
          </Form.Item>

          <Form.Item
            label="Importe"
            name="amount"
            rules={[{ required: true }, { type: 'number' }]}
          >
            <InputNumber
              className="w-40"
              prefix="$"
              precision={2}
              decimalSeparator=","
              step={100}
            />
          </Form.Item>

          <Form.Item label="Notas" name="notes">
            <Input.TextArea />
          </Form.Item>

          {/* <ButtonGroup>
            <FormSaveButton
              loading={createMovement.isLoading || updateMember.isLoading}
              disabled={createMovement.isLoading || updateMember.isLoading}
            />

            <FormBackButton
              disabled={createMovement.isLoading || updateMember.isLoading}
              to={AppUrl.Members}
            />
          </ButtonGroup> */}
        </Form>
      </Card>
    </>
  );
};
