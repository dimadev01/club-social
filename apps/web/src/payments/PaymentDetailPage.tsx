import type { ParamId } from '@club-social/shared/types';

import { MoreOutlined } from '@ant-design/icons';
import {
  DueCategory,
  DueCategoryLabel,
  type IPendingDto,
} from '@club-social/shared/dues';
import {
  type ICreatePaymentDto,
  type IPaymentDetailDto,
  type IUpdatePaymentDto,
  PaymentStatus,
  PaymentStatusLabel,
  type VoidPaymentDto,
} from '@club-social/shared/payments';
import { useQueryClient } from '@tanstack/react-query';
import {
  App,
  Button,
  DatePicker,
  Dropdown,
  Input,
  type MenuProps,
  Tag,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { APP_ROUTES } from '@/app/app.enum';
import { MemberSearchSelect } from '@/members/MemberSearchSelect';
import { useMutation } from '@/shared/hooks/useMutation';
import { useQuery } from '@/shared/hooks/useQuery';
import { DateFormat, DateFormats } from '@/shared/lib/date-format';
import { $fetch } from '@/shared/lib/fetch';
import { NumberFormat } from '@/shared/lib/number-format';
import { Card } from '@/ui/Card';
import { Form } from '@/ui/Form';
import { SaveIcon } from '@/ui/Icons/SaveIcon';
import { VoidIcon } from '@/ui/Icons/VoidIcon';
import { NotFound } from '@/ui/NotFound';
import { Table } from '@/ui/Table/Table';
import { VoidModal } from '@/ui/VoidModal';
import { usePermissions } from '@/users/use-permissions';

import { PaymentStatusColor } from './payment.types';

interface FormSchema {
  date: dayjs.Dayjs;
  memberId: string;
  notes: null | string;
  receiptNumber: null | string;
}

export function PaymentDetailPage() {
  const { message } = App.useApp();
  const permissions = usePermissions();

  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form] = Form.useForm<FormSchema>();
  const { setFieldsValue } = form;

  const formMemberId = Form.useWatch('memberId', form);

  const paymentQuery = useQuery<IPaymentDetailDto | null>({
    enabled: !!id && permissions.payments.get,
    queryFn: () => $fetch(`payments/${id}`),
    queryKey: ['payments', id],
  });

  const pendingDuesQuery = useQuery<IPendingDto[]>({
    enabled: !!formMemberId && permissions.dues.get,
    queryFn: () =>
      $fetch('/dues/pending', { query: { memberId: formMemberId } }),
    queryKey: ['dues', 'pending', formMemberId],
  });

  const createPaymentMutation = useMutation<ParamId, Error, ICreatePaymentDto>({
    mutationFn: (body) => $fetch('/payments', { body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      message.success('Pago creado correctamente');
      navigate(APP_ROUTES.PAYMENT_LIST, { replace: true });
    },
  });

  const updatePaymentMutation = useMutation<unknown, Error, IUpdatePaymentDto>({
    mutationFn: (body) => $fetch(`payments/${id}`, { body, method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payments', id] });
      message.success('Pago actualizado correctamente');
      navigate(-1);
    },
  });

  const voidPaymentMutation = useMutation<unknown, Error, VoidPaymentDto>({
    mutationFn: (body) =>
      $fetch(`payments/${id}/void`, { body, method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payments', id] });
      message.success('Pago anulado correctamente');
      navigate(-1);
    },
  });

  useEffect(() => {
    if (paymentQuery.data) {
      setFieldsValue({
        date: dayjs.utc(paymentQuery.data.date),
        memberId: '', // TODO: Extract from paymentDues when needed
        notes: paymentQuery.data.notes,
        receiptNumber: null, // Backend doesn't support this yet
      });
    }
  }, [paymentQuery.data, setFieldsValue]);

  const onSubmit = async (values: FormSchema) => {
    const date = DateFormat.isoDate(values.date.startOf('day'));

    if (id) {
      updatePaymentMutation.mutate({
        date,
        notes: values.notes || null,
        paymentDues: [], // TODO: Add payment dues handling
      });
    } else {
      createPaymentMutation.mutate({
        date,
        notes: values.notes || null,
        paymentDues: [], // TODO: Add payment dues handling
      });
    }
  };

  if (!permissions.payments.create && !id) {
    return <NotFound />;
  }

  if (!permissions.payments.update && id) {
    return <NotFound />;
  }

  const isQueryLoading = paymentQuery.isLoading;
  const isMutating =
    createPaymentMutation.isPending ||
    updatePaymentMutation.isPending ||
    voidPaymentMutation.isPending;

  const canCreate = !id && permissions.payments.create;
  const canUpdate = paymentQuery.data?.status === PaymentStatus.PAID;
  const canCreateOrUpdate = canCreate || canUpdate;
  const canVoid = paymentQuery.data?.status === PaymentStatus.PAID;

  if (id && !isQueryLoading && !paymentQuery.data) {
    return <NotFound />;
  }

  const getMoreActions = () => {
    const items: MenuProps['items'] = [];

    if (canVoid) {
      items.push({
        danger: true,
        icon: <VoidIcon />,
        key: 'void',
        label: 'Anular pago',
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
            {id ? 'Actualizar pago' : 'Crear pago'}
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
        paymentQuery.data ? (
          <Tag color={PaymentStatusColor[paymentQuery.data.status]}>
            {PaymentStatusLabel[paymentQuery.data.status]}
          </Tag>
        ) : null
      }
      loading={isQueryLoading}
      title={id ? 'Editar pago' : 'Nuevo pago'}
    >
      <Form<FormSchema>
        disabled={isMutating}
        form={form}
        id="form"
        initialValues={{
          date: dayjs(),
          memberId: undefined,
          notes: '',
          receiptNumber: '',
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
            format={DateFormats.date}
            picker="date"
          />
        </Form.Item>

        <Form.Item<FormSchema>
          label="Socio"
          name="memberId"
          rules={[{ message: 'Debe seleccionar un socio', required: true }]}
        >
          <MemberSearchSelect
            disabled={!!id}
            placeholder="Buscar y seleccionar socio..."
          />
        </Form.Item>

        <Form.Item<FormSchema> label="Número de recibo" name="receiptNumber">
          <Input
            disabled={!canCreateOrUpdate}
            placeholder="Número de recibo (opcional)"
          />
        </Form.Item>

        <Form.Item<FormSchema> label="Notas" name="notes">
          <Input.TextArea
            disabled={!canCreateOrUpdate}
            placeholder="Notas adicionales..."
            rows={3}
          />
        </Form.Item>

        <Table
          columns={[
            {
              dataIndex: 'date',
              render: (date: string) => DateFormat.date(date),
              title: 'Fecha',
              width: 100,
            },
            {
              align: 'center',
              dataIndex: 'category',
              render: (category: DueCategory) => DueCategoryLabel[category],
              title: 'Categoría',
              width: 150,
            },
            {
              dataIndex: 'amount',
              render: (amount: number) => NumberFormat.formatCents(amount),
              title: 'Monto',
              width: 100,
            },
            {
              render: () => (
                <Form.Item noStyle>
                  <Input />
                </Form.Item>
              ),
              title: 'Registro',
            },
          ]}
          dataSource={pendingDuesQuery.data}
          pagination={false}
        />
      </Form>

      <VoidModal
        onCancel={() => setIsVoidModalOpen(false)}
        onConfirm={(reason) => {
          voidPaymentMutation.mutate({ voidReason: reason });
          setIsVoidModalOpen(false);
        }}
        open={isVoidModalOpen}
      />
    </Card>
  );
}
