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
  type IPaymentDueItemDto,
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
  Descriptions,
  Dropdown,
  Empty,
  Grid,
  Input,
  InputNumber,
  type MenuProps,
  Space,
  Tag,
} from 'antd';
import dayjs from 'dayjs';
import { difference, differenceBy, orderBy } from 'es-toolkit/array';
import { flow } from 'es-toolkit/function';
import { useCallback, useEffect } from 'react';
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

interface FormPaymentDue {
  amount: number;
  dueId: string;
}

interface FormSchema {
  date: dayjs.Dayjs;
  memberId: string;
  notes: null | string;
  paymentDues: FormPaymentDue[];
  receiptNumber: null | string;
}

const calculateFinalPaymentDues = flow(
  (
    currentPaymentDues: FormPaymentDue[],
    newPaymentDuesToAdd: FormPaymentDue[],
    paymentDuesToRemove: FormPaymentDue[],
  ) =>
    differenceBy(
      [...currentPaymentDues, ...newPaymentDuesToAdd],
      paymentDuesToRemove,
      (pd) => pd.dueId,
    ),
  (arr) => orderBy(arr, ['dueId'], ['desc']),
);

export function PaymentDetailPage() {
  const { message } = App.useApp();
  const permissions = usePermissions();
  const { md } = Grid.useBreakpoint();

  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);
  const [selectedDueIds, setSelectedDueIds] = useState<string[]>([]);

  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form] = Form.useForm<FormSchema>();
  const { getFieldValue, setFieldsValue, setFieldValue } = form;

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
      queryClient.invalidateQueries({
        queryKey: ['dues', 'pending', formMemberId],
      });
      message.success('Pago creado correctamente');
      navigate(APP_ROUTES.PAYMENT_LIST, { replace: true });
    },
  });

  const updatePaymentMutation = useMutation<unknown, Error, IUpdatePaymentDto>({
    mutationFn: (body) => $fetch(`payments/${id}`, { body, method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payments', id] });
      queryClient.invalidateQueries({
        queryKey: ['dues', 'pending', formMemberId],
      });
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
      queryClient.invalidateQueries({
        queryKey: ['dues', 'pending', formMemberId],
      });
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

  const handleRowSelectionChange = useCallback(
    (newSelectedRowKeys: React.Key[]) => {
      const currentPaymentDues: FormPaymentDue[] = getFieldValue('paymentDues');
      const currentSelectedRowKeys = currentPaymentDues.map((p) => p.dueId);
      const pendingDues = pendingDuesQuery.data ?? [];

      // Find newly selected dues (not in current paymentDues)
      const newSelections = difference(
        newSelectedRowKeys,
        currentSelectedRowKeys,
      ).map(String);

      // Find deselected dues (in current paymentDues but not in newSelectedRowKeys)
      const deselected = difference(
        currentSelectedRowKeys,
        newSelectedRowKeys,
      ).map(String);

      const newPaymentDuesToAdd: FormPaymentDue[] = [];
      const paymentDuesToRemove: FormPaymentDue[] = [];

      // Add newly selected dues with full amount
      newSelections.forEach((dueId) => {
        const due = pendingDues.find((d) => d.id === dueId);

        if (due) {
          newPaymentDuesToAdd.push({
            amount: NumberFormat.fromCents(due.amount),
            dueId,
          });
        }
      });

      // Remove deselected dues
      deselected.forEach((dueId) => {
        const due = pendingDues.find((d) => d.id === dueId);

        if (due) {
          paymentDuesToRemove.push({
            amount: NumberFormat.fromCents(due.amount),
            dueId,
          });
        }
      });

      const finalFormPaymentDues = calculateFinalPaymentDues(
        currentPaymentDues,
        newPaymentDuesToAdd,
        paymentDuesToRemove,
      );

      setFieldValue('paymentDues', finalFormPaymentDues);
      setSelectedDueIds(newSelectedRowKeys as string[]);
    },
    [pendingDuesQuery.data, getFieldValue, setFieldValue],
  );

  const onSubmit = async (values: FormSchema) => {
    // Validate at least 1 payment due
    if (values.paymentDues.length === 0) {
      message.error('Debe seleccionar al menos una deuda para pagar');

      return;
    }

    const date = DateFormat.isoDate(values.date.startOf('day'));

    const paymentDues: IPaymentDueItemDto[] = values.paymentDues.map((pd) => ({
      amount: NumberFormat.toCents(pd.amount),
      dueId: pd.dueId,
    }));

    if (id) {
      updatePaymentMutation.mutate({
        date,
        notes: values.notes || null,
        paymentDues,
      });
    } else {
      createPaymentMutation.mutate({
        date,
        notes: values.notes || null,
        paymentDues,
        receiptNumber: values.receiptNumber || null,
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
          paymentDues: [],
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
              width: 150,
            },
            {
              align: 'center',
              dataIndex: 'category',
              render: (category: DueCategory, record: IPendingDto) => {
                if (category === DueCategory.MEMBERSHIP) {
                  return `${DueCategoryLabel[category]} (${DateFormat.month(record.date)})`;
                }

                return DueCategoryLabel[category];
              },
              title: 'Categoría',
              width: 150,
            },
            {
              align: 'right',
              dataIndex: 'amount',
              render: (amount: number) => NumberFormat.formatCents(amount),
              title: 'Monto',
            },
          ]}
          dataSource={pendingDuesQuery.data}
          pagination={false}
          rowSelection={{
            onChange: handleRowSelectionChange,
            selectedRowKeys: selectedDueIds,
            type: 'checkbox',
          }}
          size="small"
        />

        <Form.List name="paymentDues">
          {(fields) => {
            return (
              <Card size="small" title="Deudas Seleccionadas" type="inner">
                {fields.length === 0 && (
                  <Empty
                    description="Seleccione deudas de la tabla para registrar pagos"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}

                {fields.map((field) => {
                  const paymentDue = form.getFieldValue([
                    'paymentDues',
                    field.name,
                  ]);
                  const due = pendingDuesQuery.data?.find(
                    (d) => d.id === paymentDue?.dueId,
                  );

                  if (!due) {
                    return null;
                  }

                  const maxAmount = NumberFormat.fromCents(due.amount);

                  return (
                    <Card.Grid
                      className="w-full md:w-1/2 lg:w-1/3"
                      key={field.key}
                    >
                      <Form.Item hidden name={[field.name, 'dueId']} noStyle>
                        <Input />
                      </Form.Item>
                      <Space className="flex" size="middle" vertical>
                        <Descriptions
                          bordered
                          column={1}
                          layout={md ? 'horizontal' : 'vertical'}
                          size="small"
                        >
                          <Descriptions.Item label="Fecha">
                            {DateFormat.date(due.date)}
                          </Descriptions.Item>
                          <Descriptions.Item label="Categoría">
                            {DueCategoryLabel[due.category]}
                          </Descriptions.Item>
                          <Descriptions.Item label="Monto a pagar">
                            {NumberFormat.formatCents(due.amount)}
                          </Descriptions.Item>
                        </Descriptions>

                        <Form.Item
                          label="Monto a registrar"
                          name={[field.name, 'amount']}
                          rules={[
                            {
                              message: 'Ingrese el monto a pagar',
                              required: true,
                            },
                          ]}
                        >
                          <InputNumber
                            className="w-full"
                            formatter={(value) =>
                              NumberFormat.format(Number(value))
                            }
                            max={maxAmount}
                            min={1}
                            parser={(value) =>
                              NumberFormat.parse(String(value))
                            }
                            precision={0}
                            step={1000}
                          />
                        </Form.Item>
                      </Space>
                    </Card.Grid>
                  );
                })}
              </Card>
            );
          }}
        </Form.List>
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
