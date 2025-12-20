import type { IMemberSearchResultDto } from '@club-social/shared/members';
import type { ParamId } from '@club-social/shared/types';

import {
  type CreateDueDto,
  DueCategory,
  DueCategoryLabel,
  DueStatus,
  DueStatusLabel,
  type IDueDetailDto,
  type IUpdateDueDto,
  type VoidDueDto,
} from '@club-social/shared/dues';
import { useQueryClient } from '@tanstack/react-query';
import {
  App,
  Button,
  Card,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  Skeleton,
  Space,
  Tag,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { APP_ROUTES } from '@/app/app.enum';
import { MemberSearchSelect } from '@/members/MemberSearchSelect';
import { useMemberById } from '@/members/useMemberById';
import { useMutation } from '@/shared/hooks/useMutation';
import { useQuery } from '@/shared/hooks/useQuery';
import { DateFormat } from '@/shared/lib/date-format';
import { $fetch } from '@/shared/lib/fetch';
import { NumberFormat } from '@/shared/lib/number-format';
import { Form } from '@/ui/Form/Form';
import { AddNewIcon } from '@/ui/Icons/AddNewIcon';
import { BackIcon } from '@/ui/Icons/BackIcon';
import { SaveIcon } from '@/ui/Icons/SaveIcon';
import { NotFound } from '@/ui/NotFound';
import { Select } from '@/ui/Select';
import { Table } from '@/ui/Table/Table';
import { usePermissions } from '@/users/use-permissions';

import { DueStatusColor } from './due.types';
import { VoidDueButton } from './VoidDueButton';

interface FormSchema {
  amount: number;
  category: DueCategory;
  date: dayjs.Dayjs;
  memberIds: string[];
  notes: null | string;
}

export function DueDetailPage() {
  const { message } = App.useApp();
  const permissions = usePermissions();

  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form] = Form.useForm<FormSchema>();
  const { setFieldsValue } = form;
  const formCategory = Form.useWatch('category', form);

  const dueQuery = useQuery<IDueDetailDto | null>({
    enabled: !!id && permissions.dues.get,
    queryFn: () => $fetch(`dues/${id}`),
    queryKey: ['dues', id],
  });

  const memberQuery = useMemberById({
    enabled: !!id,
    memberId: dueQuery.data?.memberId,
  });

  const createDueMutation = useMutation<ParamId, Error, CreateDueDto>({
    mutationFn: (body) => $fetch('/dues', { body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dues'] });
    },
  });

  const updateDueMutation = useMutation<unknown, Error, IUpdateDueDto>({
    mutationFn: (body) => $fetch(`dues/${id}`, { body, method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dues'] });
      queryClient.invalidateQueries({ queryKey: ['dues', id] });
      message.success('Cuota actualizada correctamente');
      navigate(-1);
    },
  });

  const voidDueMutation = useMutation<unknown, Error, VoidDueDto>({
    mutationFn: (body) => $fetch(`dues/${id}/void`, { body, method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dues'] });
      queryClient.invalidateQueries({ queryKey: ['dues', id] });
      message.success('Cuota anulada correctamente');
      navigate(-1);
    },
  });

  useEffect(() => {
    if (dueQuery.data) {
      setFieldsValue({
        amount: NumberFormat.fromCents(dueQuery.data.amount),
        category: dueQuery.data.category,
        date: dayjs.utc(dueQuery.data.date),
        memberIds: [dueQuery.data.memberId],
        notes: dueQuery.data.notes,
      });
    }
  }, [dueQuery.data, setFieldsValue]);

  const onSubmit = async (values: FormSchema) => {
    const amount = NumberFormat.toCents(values.amount);

    let date: string;

    if (formCategory === DueCategory.MEMBERSHIP) {
      date = DateFormat.isoDate(values.date.startOf('month'));
    } else {
      date = DateFormat.isoDate(values.date.startOf('day'));
    }

    if (id) {
      updateDueMutation.mutate({ amount, notes: values.notes || null });
    } else {
      const results = await Promise.allSettled(
        values.memberIds.map((memberId) =>
          createDueMutation.mutateAsync({
            amount,
            category: values.category,
            date,
            memberId,
            notes: values.notes || null,
          }),
        ),
      );
      const successfulResults = results.filter(
        (result) => result.status === 'fulfilled',
      );
      const failedResults = results.filter(
        (result) => result.status === 'rejected',
      );

      if (failedResults.length > 0) {
        message.error('Error al crear las deudas');

        return;
      }

      message.success(
        `${successfulResults.length} deudas creadas correctamente`,
      );
      navigate(APP_ROUTES.DUE_LIST, { replace: true });
    }
  };

  const isLoading =
    dueQuery.isLoading ||
    (id && memberQuery.isLoading) ||
    createDueMutation.isPending ||
    updateDueMutation.isPending;

  if (!permissions.dues.create && !id) {
    return <NotFound />;
  }

  if (!permissions.dues.update && id) {
    return <NotFound />;
  }

  const memberAdditionalOptions: IMemberSearchResultDto[] = memberQuery.data
    ? [
        {
          id: memberQuery.data.id,
          name: memberQuery.data.name,
          status: memberQuery.data.status,
        },
      ]
    : [];

  return (
    <Card
      actions={[
        <Button
          disabled={isLoading}
          icon={<BackIcon />}
          onClick={() => navigate(-1)}
          type="link"
        >
          Cancelar
        </Button>,
        <Space.Compact>
          {!id && (
            <Button
              disabled={isLoading}
              htmlType="button"
              icon={<AddNewIcon />}
              loading={createDueMutation.isPending}
              onClick={() => navigate(APP_ROUTES.DUE_NEW)}
              type="default"
            >
              Crear y volver
            </Button>
          )}
          <Button
            disabled={isLoading}
            form="form"
            htmlType="submit"
            icon={<SaveIcon />}
            loading={createDueMutation.isPending || updateDueMutation.isPending}
            type="primary"
          >
            {id ? 'Actualizar deuda' : 'Crear deuda'}
          </Button>
        </Space.Compact>,
        dueQuery.data?.status === DueStatus.PENDING && (
          <VoidDueButton
            onConfirm={(reason) => {
              voidDueMutation.mutate({ voidReason: reason });
            }}
          />
        ),
      ].filter(Boolean)}
      extra={
        dueQuery.data ? (
          <Tag color={DueStatusColor[dueQuery.data.status]}>
            {DueStatusLabel[dueQuery.data.status]}
          </Tag>
        ) : null
      }
      loading={dueQuery.isLoading}
      title={
        <Space>
          {dueQuery.isLoading && <Skeleton.Input active />}
          {!dueQuery.isLoading && <>{id ? 'Editar deuda' : 'Nueva deuda'}</>}
        </Space>
      }
    >
      <Form<FormSchema>
        disabled={isLoading}
        form={form}
        id="form"
        initialValues={{
          amount: 0,
          category: DueCategory.MEMBERSHIP,
          date: dayjs(),
          memberIds: [],
          notes: null,
        }}
        name="form"
        onFinish={onSubmit}
      >
        <Form.Item<FormSchema>
          label="Fecha"
          name="date"
          rules={[{ message: 'La fecha es requerida', required: true }]}
        >
          <DatePicker
            allowClear={false}
            className="w-full"
            disabled={!!id}
            format={
              formCategory === DueCategory.MEMBERSHIP
                ? 'MMMM YYYY'
                : 'DD/MM/YYYY'
            }
            picker={formCategory === DueCategory.MEMBERSHIP ? 'month' : 'date'}
          />
        </Form.Item>

        <Form.Item<FormSchema>
          label={id ? 'Socio' : 'Socio/s'}
          name="memberIds"
          rules={[
            { message: 'Debe seleccionar al menos un socio', required: true },
          ]}
        >
          <MemberSearchSelect
            additionalOptions={memberAdditionalOptions}
            disabled={!!id}
            loading={id ? memberQuery.isLoading : false}
            mode={id ? undefined : 'multiple'}
            placeholder="Buscar y seleccionar socios..."
          />
        </Form.Item>

        <Form.Item<FormSchema>
          label="Categoría"
          name="category"
          rules={[{ message: 'La categoría es requerida', required: true }]}
        >
          <Select
            disabled={!!id}
            options={Object.entries(DueCategoryLabel).map(([key, value]) => ({
              label: value,
              value: key,
            }))}
          />
        </Form.Item>

        <Form.Item<FormSchema>
          label="Monto"
          name="amount"
          rules={[
            { message: 'El monto es requerido', required: true },
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject(new Error('El monto es requerido'));
                }

                if (value < 1) {
                  return Promise.reject(
                    new Error('El monto debe ser mayor a 1'),
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber<number>
            className="w-full"
            formatter={(value) => NumberFormat.format(Number(value))}
            min={0}
            parser={(value) => NumberFormat.parse(String(value))}
            precision={0}
            prefix="ARS"
            step={1000}
          />
        </Form.Item>

        <Form.Item<FormSchema> label="Notas" name="notes">
          <Input.TextArea placeholder="Notas adicionales..." rows={3} />
        </Form.Item>
      </Form>

      <Divider />

      {dueQuery.data && (
        <Card title="Pagos" type="inner">
          <Table dataSource={[]} />
        </Card>
      )}
    </Card>
  );
}
