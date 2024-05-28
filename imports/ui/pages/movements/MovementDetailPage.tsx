import { ARS } from '@dinero.js/currencies';
import {
  App,
  Breadcrumb,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Skeleton,
} from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import { useWatch } from 'antd/es/form/Form';
import dayjs, { Dayjs } from 'dayjs';
import find from 'lodash/find';
import { Roles } from 'meteor/alanning:roles';
import React from 'react';
import { NavLink, Navigate, useNavigate, useParams } from 'react-router-dom';

import {
  CategoryEnum,
  CategoryLabel,
  CategoryTypeEnum,
  MemberCategories,
  getCategoryTypeOptions,
} from '@domain/categories/category.enum';
import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { MoneyUtils } from '@shared/utils/money.utils';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button';
import { FormButtons } from '@ui/components/Form/FormButtons';
import { NotFound } from '@ui/components/NotFound';
import { Select } from '@ui/components/Select';
import { useCategoriesByType } from '@ui/hooks/categories/useCategoriesByType';
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
  serviceId: string | undefined;
  type: CategoryTypeEnum;
};

export const MovementDetailPage = () => {
  const [form] = Form.useForm<FormValues>();

  const category = useWatch(['category'], form);

  const type = useWatch(['type'], form);

  const { id } = useParams<{ id?: string }>();

  const navigate = useNavigate();

  const { message } = App.useApp();

  const {
    data: movement,
    fetchStatus: movementFetchStatus,
    refetch,
  } = useMovement(id);

  const createMovement = useCreateMovement();

  const updateMovement = useUpdateMovement();

  const { data: members, isLoading: isLoadingMembers } = useMembers(
    MemberCategories.includes(category),
  );

  const { data: categoriesByType, isLoading: isLoadingCategoriesByType } =
    useCategoriesByType(type);

  const { data: professors, isLoading: isLoadingProfessors } = useProfessors(
    category === CategoryEnum.Professor,
  );

  const { data: employees, isLoading: isLoadingEmployees } = useEmployees(
    category === CategoryEnum.Employee,
  );

  const { data: services, isLoading: isLoadingServices } = useServices(
    category === CategoryEnum.Service,
  );

  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Login} />;
  }

  const handleSubmit = async (values: FormValues) => {
    if (!movement) {
      await createMovement.mutateAsync(
        {
          amount: MoneyUtils.toCents(values.amount),
          category: values.category,
          date: DateUtils.format(values.date, DateFormatEnum.Date),
          employeeId: values.employeeId ?? null,
          memberIds: values.memberIds ?? null,
          notes: values.notes,
          professorId: values.professorId ?? null,
          serviceId: values.serviceId ?? null,
          type: values.type,
        },
        {
          onSuccess: () => {
            message.success('Movimiento creado');

            navigate(-1);
          },
        },
      );
    } else {
      await updateMovement.mutateAsync(
        {
          amount: MoneyUtils.toCents(values.amount),
          date: DateUtils.format(values.date, DateFormatEnum.Date),
          employeeId: values.employeeId ?? null,
          id: movement._id,
          memberId: values.memberId ?? null,
          notes: values.notes,
          professorId: values.professorId ?? null,
          serviceId: values.serviceId ?? null,
        },
        {
          onSuccess: () => {
            message.success('Movimiento actualizado');

            refetch();
          },
        },
      );
    }
  };

  const isLoading = movementFetchStatus === 'fetching';

  if (id && !movement && !isLoading) {
    return <NotFound />;
  }

  const getPriceForCategory = (value: CategoryEnum): number => {
    const foundCategory = find(categoriesByType, { code: value });

    return foundCategory?.amount
      ? MoneyUtils.fromCents(foundCategory.amount)
      : 0;
  };

  const canCreateOrUpdateMovement =
    Roles.userIsInRole(user, PermissionEnum.CREATE, ScopeEnum.MOVEMENTS) ||
    Roles.userIsInRole(user, PermissionEnum.UPDATE, ScopeEnum.MOVEMENTS);

  const renderDetailsSection = () => {
    if (MemberCategories.includes(category)) {
      /**
       * If we have a movement, we can only update a single member
       */
      if (movement) {
        return (
          <Form.Item label="Socio" name="memberId" rules={[{ required: true }]}>
            <Select
              disabled={isLoadingMembers || !canCreateOrUpdateMovement}
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
          help={
            category === CategoryEnum.MembershipDebt && (
              <ButtonGroup>
                <Button
                  size="small"
                  htmlType="button"
                  type="text"
                  onClick={() => {
                    form.setFieldValue(
                      'memberIds',
                      members
                        ?.filter(
                          (member) =>
                            member.category === MemberCategoryEnum.MEMBER &&
                            member.status === MemberStatusEnum.ACTIVE,
                        )
                        .map((member) => member._id) ?? [],
                    );
                  }}
                >
                  Seleccionar todos los socios
                </Button>
                <Button
                  size="small"
                  htmlType="button"
                  type="text"
                  onClick={() => {
                    form.setFieldValue(
                      'memberIds',
                      members
                        ?.filter(
                          (member) =>
                            member.category === MemberCategoryEnum.CADET &&
                            member.status === MemberStatusEnum.ACTIVE,
                        )
                        .map((member) => member._id) ?? [],
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
            disabled={isLoadingMembers || !canCreateOrUpdateMovement}
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
            disabled={isLoadingProfessors || !canCreateOrUpdateMovement}
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
            disabled={isLoadingEmployees || !canCreateOrUpdateMovement}
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
            disabled={isLoadingServices || !canCreateOrUpdateMovement}
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

  if (
    movement &&
    [
      CategoryEnum.MembershipIncome,
      CategoryEnum.GuestIncome,
      CategoryEnum.ElectricityIncome,
    ].includes(movement.category)
  ) {
    return <Navigate to={`${AppUrl.Movements}/${movement._id}/migrate`} />;
  }

  /**
   * Component
   */
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
            disabled={!canCreateOrUpdateMovement}
            form={form}
            onFinish={(values) => handleSubmit(values)}
            initialValues={{
              amount: movement
                ? MoneyUtils.fromCents(movement.amount)
                : getPriceForCategory(CategoryEnum.MembershipIncome),
              category: movement?.category,
              date: movement?.date
                ? DateUtils.utc(movement.date, DateFormatEnum.DDMMYYYY)
                : undefined,
              employeeId: movement?.employeeId,
              memberId: movement?.memberId,
              memberIds: undefined,
              notes: movement?.notes,
              professorId: movement?.professorId,
              serviceId: movement?.serviceId,
              type: movement?.type ?? CategoryTypeEnum.Income,
            }}
          >
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

            <Form.Item label="Tipo" name="type" rules={[{ required: true }]}>
              <Select
                disabled={!!movement}
                onChange={() => {
                  form.setFieldValue('category', null);

                  form.setFieldValue('amount', null);
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
                  disabled={isLoadingCategoriesByType || !!movement}
                  loading={isLoadingCategoriesByType}
                  onChange={(value) =>
                    form.setFieldValue('amount', getPriceForCategory(value))
                  }
                  options={
                    categoriesByType
                      ?.filter(
                        (categoryByType) =>
                          ![
                            CategoryEnum.GuestIncome,
                            CategoryEnum.MembershipIncome,
                            CategoryEnum.ElectricityIncome,
                          ].includes(categoryByType.code),
                      )
                      .map((categoryByType) => ({
                        label: categoryByType.name,
                        value: categoryByType.code,
                      })) ?? []
                  }
                />
              </Form.Item>
            )}

            {renderDetailsSection()}

            <Form.Item
              label="Importe"
              name="amount"
              rules={[{ required: true }, { min: 1, type: 'number' }]}
            >
              <InputNumber
                className="w-32"
                prefix={ARS.code}
                precision={0}
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

            <FormButtons scope={ScopeEnum.MOVEMENTS} />
          </Form>
        </Card>
      </Skeleton>
    </>
  );
};
