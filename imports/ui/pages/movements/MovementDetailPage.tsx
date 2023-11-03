import React from 'react';
import {
  Breadcrumb,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Skeleton,
} from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import { useWatch } from 'antd/es/form/Form';
import dayjs, { Dayjs } from 'dayjs';
import find from 'lodash/find';
import { NavLink, useParams } from 'react-router-dom';
import { ARS } from '@dinero.js/currencies';
import {
  CategoryEnum,
  CategoryLabel,
  CategoryTypeEnum,
  getCategoryOptions,
  getCategoryTypeOptions,
  MemberCategories,
} from '@domain/categories/category.enum';
import { MemberCategory, MemberStatus } from '@domain/members/members.enum';
import { CurrencyUtils } from '@shared/utils/currency.utils';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button';
import { FormBackButton } from '@ui/components/Form/FormBackButton';
import { FormSaveButton } from '@ui/components/Form/FormSaveButton';
import { NotFound } from '@ui/components/NotFound';
import { Select } from '@ui/components/Select';
import { useCategories } from '@ui/hooks/categories/useCategories';
import { useEmployees } from '@ui/hooks/employees/useEmployees';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useCreateMovement } from '@ui/hooks/movements/useCreateMovement';
import { useMovement } from '@ui/hooks/movements/useMovement';
import { useUpdateMovement } from '@ui/hooks/movements/useUpdateMovement';
import { useProfessors } from '@ui/hooks/professors/useProfessors';
import { useServices } from '@ui/hooks/services/useServices';

type FormValues = {
  amount: number;
  category: CategoryEnum;
  date: Dayjs;
  employeeId: string | undefined;
  memberId: string | undefined;
  memberIds: string[] | undefined;
  notes: string;
  professorId: string | undefined;
  rentalId: string | undefined;
  serviceId: string | undefined;
  type: CategoryTypeEnum;
};

export const MovementDetailPage = () => {
  const [form] = Form.useForm<FormValues>();

  const category = useWatch(['category'], form);

  const type = useWatch(['type'], form);

  const { id } = useParams<{ id?: string }>();

  const {
    data: movement,
    fetchStatus: movementFetchStatus,
    refetch,
  } = useMovement(id);

  const createMovement = useCreateMovement();

  const updateMovement = useUpdateMovement();

  const { data: members, isLoading: isLoadingMembers } = useMembers(
    MemberCategories.includes(category)
  );

  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const { data: professors, isLoading: isLoadingProfessors } = useProfessors(
    category === CategoryEnum.Professor
  );

  const { data: employees, isLoading: isLoadingEmployees } = useEmployees(
    category === CategoryEnum.Employee
  );

  const { data: services, isLoading: isLoadingServices } = useServices(
    category === CategoryEnum.Service
  );

  const handleSubmit = async (values: FormValues) => {
    if (!movement) {
      await createMovement.mutateAsync(
        {
          amount: CurrencyUtils.toCents(values.amount),
          category: values.category,
          date: DateUtils.format(values.date),
          employeeId: values.employeeId ?? null,
          memberIds: values.memberIds ?? null,
          notes: values.notes,
          professorId: values.professorId ?? null,
          rentalId: values.rentalId ?? null,
          serviceId: values.serviceId ?? null,
          type: values.type,
        },
        {
          onSuccess: () => {
            message.success('Movimiento creado');
          },
        }
      );
    } else {
      await updateMovement.mutateAsync(
        {
          amount: CurrencyUtils.toCents(values.amount),
          date: DateUtils.format(values.date),
          employeeId: values.employeeId ?? null,
          id: movement._id,
          memberId: values.memberId ?? null,
          notes: values.notes,
          professorId: values.professorId ?? null,
          rentalId: values.rentalId ?? null,
          serviceId: values.serviceId ?? null,
        },
        {
          onSuccess: () => {
            message.success('Movimiento actualizado');

            refetch();
          },
        }
      );
    }
  };

  const isLoading = movementFetchStatus === 'fetching' || isLoadingCategories;

  if (id && !movement && !isLoading) {
    return <NotFound />;
  }

  const getPriceForCategory = (value: CategoryEnum): number => {
    const foundCategory = find(categories, { code: value });

    return foundCategory?.amount
      ? CurrencyUtils.fromCents(foundCategory.amount)
      : 0;
  };

  const renderDetailsSection = () => {
    if (MemberCategories.includes(category)) {
      /**
       * If we have a movement, we can only update a single member
       */
      if (movement) {
        return (
          <Form.Item label="Socio" name="memberId" rules={[{ required: true }]}>
            <Select
              disabled={isLoadingMembers}
              loading={isLoadingMembers}
              options={members?.map((member) => ({
                label: member.name,
                value: member._id,
              }))}
            />
          </Form.Item>
        );
      }

      return (
        <Form.Item
          className="cs-form-item-extra"
          help={
            category === CategoryEnum.MembershipDebt && (
              <ButtonGroup>
                <Button
                  size="small"
                  htmlType="button"
                  type="ghost"
                  onClick={() => {
                    form.setFieldValue(
                      'memberIds',
                      members
                        ?.filter(
                          (member) =>
                            member.category === MemberCategory.Member &&
                            member.status === MemberStatus.Active
                        )
                        .map((member) => member._id) ?? []
                    );
                  }}
                >
                  Seleccionar todos los socios
                </Button>
                <Button
                  size="small"
                  htmlType="button"
                  type="ghost"
                  onClick={() => {
                    form.setFieldValue(
                      'memberIds',
                      members
                        ?.filter(
                          (member) =>
                            member.category === MemberCategory.Cadet &&
                            member.status === MemberStatus.Active
                        )
                        .map((member) => member._id) ?? []
                    );
                  }}
                >
                  Seleccionar todos los cadetes
                </Button>
              </ButtonGroup>
            )
          }
          label="Socio/s"
          name="memberIds"
          rules={[{ required: true }, { min: 1, type: 'array' }]}
        >
          <Select
            mode="multiple"
            disabled={isLoadingMembers}
            loading={isLoadingMembers}
            options={members?.map((member) => ({
              label: member.name,
              value: member._id,
            }))}
          />
        </Form.Item>
      );
    }

    if (category === CategoryEnum.Professor) {
      return (
        <Form.Item
          label="Profesor"
          name="professorId"
          rules={[{ required: true }]}
        >
          <Select
            disabled={isLoadingProfessors}
            loading={isLoadingProfessors}
            options={professors?.map((professor) => ({
              label: professor.name,
              value: professor._id,
            }))}
          />
        </Form.Item>
      );
    }

    if (category === CategoryEnum.Employee) {
      return (
        <Form.Item
          label="Empleado"
          name="employeeId"
          rules={[{ required: true }]}
        >
          <Select
            disabled={isLoadingEmployees}
            loading={isLoadingEmployees}
            options={employees?.map((employee) => ({
              label: employee.name,
              value: employee._id,
            }))}
          />
        </Form.Item>
      );
    }

    if (category === CategoryEnum.Service) {
      return (
        <Form.Item
          label="Servicio"
          name="serviceId"
          rules={[{ required: true }]}
        >
          <Select
            disabled={isLoadingServices}
            loading={isLoadingServices}
            options={services?.map((service) => ({
              label: service.name,
              value: service._id,
            }))}
          />
        </Form.Item>
      );
    }

    return null;
  };

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[
          {
            title: 'Inicio',
          },
          {
            title: <NavLink to={AppUrl.Movements}>Movimientos</NavLink>,
          },
          {
            title: movement
              ? `${movement.date} - ${CategoryLabel[movement.category]} - ${
                  movement.amountFormatted
                }`
              : 'Nuevo Movimiento',
          },
        ]}
      />

      <Skeleton active loading={isLoading}>
        <Card>
          <Form<FormValues>
            layout="vertical"
            form={form}
            onFinish={(values) => handleSubmit(values)}
            initialValues={{
              amount: movement
                ? CurrencyUtils.fromCents(movement.amount)
                : getPriceForCategory(CategoryEnum.MembershipIncome),
              category: movement?.category ?? CategoryEnum.MembershipIncome,
              date: movement?.date
                ? dayjs.utc(movement.date, DateFormatEnum.DD_MM_YYYY)
                : undefined,
              memberId: movement?.memberId,
              memberIds: undefined,
              notes: movement?.notes,
              type: movement?.type ?? CategoryTypeEnum.Income,
            }}
          >
            <Form.Item
              name="date"
              label="Fecha"
              rules={[{ required: true }, { type: 'date' }]}
            >
              <DatePicker
                format={DateFormatEnum.DD_MM_YYYY}
                className="w-full"
                disabledDate={(current) =>
                  current.isAfter(dayjs().add(1, 'day'))
                }
              />
            </Form.Item>

            <Form.Item label="Tipo" name="type" rules={[{ required: true }]}>
              <Select
                disabled={!!movement}
                onChange={() => {
                  form.setFieldValue('category', undefined);

                  form.setFieldValue('amount', undefined);
                }}
                options={getCategoryTypeOptions()}
              />
            </Form.Item>

            {type && (
              <Form.Item
                label="Categoría"
                name="category"
                rules={[{ required: true }]}
              >
                <Select
                  disabled={isLoadingCategories || !!movement}
                  loading={isLoadingCategories}
                  onChange={(value) =>
                    form.setFieldValue('amount', getPriceForCategory(value))
                  }
                  options={getCategoryOptions(type)}
                />
              </Form.Item>
            )}

            {renderDetailsSection()}

            <Form.Item
              label="Importe"
              name="amount"
              rules={[{ required: true }, { min: 1, type: 'number' }]}
              status="error"
            >
              <InputNumber
                className="w-40"
                prefix={ARS.code}
                precision={2}
                decimalSeparator=","
                step={100}
              />
            </Form.Item>

            <Form.Item
              label="Notas"
              rules={[{ whitespace: true }]}
              name="notes"
            >
              <Input.TextArea rows={1} />
            </Form.Item>

            <ButtonGroup>
              <FormSaveButton
                loading={createMovement.isLoading || updateMovement.isLoading}
                disabled={createMovement.isLoading || updateMovement.isLoading}
              />

              <FormBackButton
                disabled={createMovement.isLoading || updateMovement.isLoading}
              />
            </ButtonGroup>
          </Form>
        </Card>
      </Skeleton>
    </>
  );
};
