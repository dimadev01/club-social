import type { IMemberSearchResultDto } from '@club-social/shared/members';
import type { ParamId } from '@club-social/shared/types';

import { MoreOutlined } from '@ant-design/icons';
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
  DatePicker,
  Divider,
  Dropdown,
  Input,
  InputNumber,
  type MenuProps,
  Tag,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { APP_ROUTES } from '@/app/app.enum';
import { MemberSearchSelect } from '@/members/MemberSearchSelect';
import { useMutation } from '@/shared/hooks/useMutation';
import { useQuery } from '@/shared/hooks/useQuery';
import { DateFormat, DateFormats } from '@/shared/lib/date-format';
import { $fetch } from '@/shared/lib/fetch';
import { NumberFormat } from '@/shared/lib/number-format';
import { queryKeys } from '@/shared/lib/query-keys';
import { Card } from '@/ui/Card';
import { Form } from '@/ui/Form';
import { SaveIcon } from '@/ui/Icons/SaveIcon';
import { VoidIcon } from '@/ui/Icons/VoidIcon';
import { NotFound } from '@/ui/NotFound';
import { Select } from '@/ui/Select';
import { Table } from '@/ui/Table/Table';
import { usePermissions } from '@/users/use-permissions';

import { VoidModal } from '../ui/VoidModal';
import { DueStatusColor } from './due.types';

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

  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form] = Form.useForm<FormSchema>();
  const { setFieldsValue } = form;
  const formCategory = Form.useWatch('category', form);

  const dueQuery = useQuery<IDueDetailDto | null>({
    ...queryKeys.dues.detail(id),
    enabled: !!id && permissions.dues.get,
    queryFn: () => $fetch(`dues/${id}`),
  });

  const createDueMutation = useMutation<ParamId, Error, CreateDueDto>({
    mutationFn: (body) => $fetch('/dues', { body }),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.dues.detail(id));
      queryClient.invalidateQueries({
        queryKey: queryKeys.dues.paginated._def,
      });
      queryClient.invalidateQueries(
        queryKeys.dues.pending(dueQuery.data?.memberId),
      );
    },
  });

  const updateDueMutation = useMutation<unknown, Error, IUpdateDueDto>({
    mutationFn: (body) => $fetch(`dues/${id}`, { body, method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.dues.detail(id));
      queryClient.invalidateQueries({
        queryKey: queryKeys.dues.paginated._def,
      });
      message.success('Cuota actualizada correctamente');
      navigate(-1);
    },
  });

  const voidDueMutation = useMutation<unknown, Error, VoidDueDto>({
    mutationFn: (body) => $fetch(`dues/${id}/void`, { body, method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.dues.detail(id));
      queryClient.invalidateQueries(
        queryKeys.dues.pending(dueQuery.data?.memberId),
      );
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
      navigate(APP_ROUTES.DUES_LIST, { replace: true });
    }
  };

  if (!permissions.dues.create && !id) {
    return <NotFound />;
  }

  if (!permissions.dues.update && id) {
    return <NotFound />;
  }

  const isQueryLoading = dueQuery.isLoading;
  const isMutating =
    createDueMutation.isPending ||
    updateDueMutation.isPending ||
    voidDueMutation.isPending;

  const canCreate = !id && permissions.dues.create;
  const canUpdate = dueQuery.data?.status === DueStatus.PENDING;
  const canCreateOrUpdate = canCreate || canUpdate;
  const canVoid = dueQuery.data?.status === DueStatus.PENDING;

  if (id && !isQueryLoading && !dueQuery.data) {
    return <NotFound />;
  }

  const memberAdditionalOptions: IMemberSearchResultDto[] = dueQuery.data
    ? [
        {
          id: dueQuery.data.memberId,
          name: dueQuery.data.memberName,
          status: dueQuery.data.userStatus,
        },
      ]
    : [];

  const getMoreActions = () => {
    const items: MenuProps['items'] = [];

    if (canVoid) {
      items.push({
        danger: true,
        icon: <VoidIcon />,
        key: 'void',
        label: 'Anular deuda',
        onClick: () => setIsVoidModalOpen(true),
      });
    }

    return items;
  };

  const moreActions = getMoreActions();

  return (
    <Card
      actions={[
        canCreateOrUpdate && (
          <Button
            disabled={isMutating}
            form="form"
            htmlType="submit"
            icon={<SaveIcon />}
            loading={isMutating}
            type="primary"
          >
            {id ? 'Actualizar deuda' : 'Crear deuda'}
          </Button>
        ),
        moreActions.length > 0 && (
          <Dropdown disabled={isMutating} menu={{ items: moreActions }}>
            <Button icon={<MoreOutlined />}>Más opciones</Button>
          </Dropdown>
        ),
      ].filter(Boolean)}
      backButton
      extra={
        dueQuery.data ? (
          <Tag color={DueStatusColor[dueQuery.data.status]}>
            {DueStatusLabel[dueQuery.data.status]}
          </Tag>
        ) : null
      }
      loading={isQueryLoading}
      title={id ? 'Editar deuda' : 'Nueva deuda'}
    >
      <Form<FormSchema>
        disabled={isMutating}
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
                ? DateFormats.monthYear
                : DateFormats.date
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
            loading={isQueryLoading}
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
            disabled={!canCreateOrUpdate}
            formatter={(value) => NumberFormat.format(Number(value))}
            min={0}
            parser={(value) => NumberFormat.parse(String(value))}
            precision={0}
            step={1000}
          />
        </Form.Item>

        <Form.Item<FormSchema> label="Notas" name="notes">
          <Input.TextArea
            disabled={!canCreateOrUpdate}
            placeholder="Notas adicionales..."
            rows={3}
          />
        </Form.Item>
      </Form>

      <Divider />

      {dueQuery.data && (
        <Card title="Pagos" type="inner">
          <Table dataSource={[]} />
        </Card>
      )}

      <VoidModal
        onCancel={() => setIsVoidModalOpen(false)}
        onConfirm={(reason) => {
          voidDueMutation.mutate({ voidReason: reason });
          setIsVoidModalOpen(false);
        }}
        open={isVoidModalOpen}
      />
    </Card>
  );
}
