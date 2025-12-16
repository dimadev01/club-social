import type { MemberDto } from '@club-social/shared/members';
import type { ParamId } from '@club-social/shared/types';

import {
  CloseOutlined,
  DollarOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  type CreateDueDto,
  DueCategory,
  DueCategoryLabel,
  type DueDto,
  type UpdateDueDto,
} from '@club-social/shared/dues';
import { useQueryClient } from '@tanstack/react-query';
import {
  App,
  Button,
  Card,
  DatePicker,
  Input,
  InputNumber,
  Skeleton,
  Space,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { APP_ROUTES } from '@/app/app.enum';
import { $fetch } from '@/shared/lib/fetch';
import { NumberFormat } from '@/shared/lib/number-format';
import { useMutation } from '@/shared/lib/useMutation';
import { useQuery } from '@/shared/lib/useQuery';
import { Form } from '@/ui/Form/Form';
import { NotFound } from '@/ui/NotFound';
import { Select } from '@/ui/Select';
import { usePermissions } from '@/users/use-permissions';

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

  const dueQuery = useQuery<DueDto | null>({
    enabled: !!id && permissions.dues.get,
    queryFn: () => $fetch(`dues/${id}`),
    queryKey: ['dues', id],
  });

  const membersQuery = useQuery<MemberDto[]>({
    enabled: permissions.members.list,
    queryFn: () => $fetch('members'),
    queryKey: ['members'],
  });

  const createDueMutation = useMutation<ParamId, Error, CreateDueDto>({
    mutationFn: (body) => $fetch('/dues', { body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dues'] });
    },
  });

  const updateDueMutation = useMutation<unknown, Error, UpdateDueDto>({
    mutationFn: (body) => $fetch(`dues/${id}`, { body, method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dues'] });
      queryClient.invalidateQueries({ queryKey: ['dues', id] });
      message.success('Cuota actualizada correctamente');
      navigate(-1);
    },
  });

  useEffect(() => {
    if (dueQuery.data) {
      setFieldsValue({
        amount: dueQuery.data.amount / 100,
        category: dueQuery.data.category,
        date: dayjs.utc(dueQuery.data.date),
        memberIds: [dueQuery.data.memberId],
        notes: dueQuery.data.notes,
      });
    }
  }, [dueQuery.data, setFieldsValue]);

  const onSubmit = async (values: FormSchema) => {
    const amountInCents = Math.round(values.amount * 100);

    if (id) {
      updateDueMutation.mutate({
        amount: amountInCents,
        category: values.category,
        date: values.date.utc().toISOString(),
        notes: values.notes || null,
      });
    } else {
      const results = await Promise.allSettled(
        values.memberIds.map((memberId) =>
          createDueMutation.mutateAsync({
            amount: amountInCents,
            category: values.category,
            date: values.date.utc().toISOString(),
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
        message.error('Error al crear las cuotas');

        return;
      }

      message.success(
        `${successfulResults.length} cuotas creadas correctamente`,
      );
      navigate(APP_ROUTES.DUE_LIST, { replace: true });
    }
  };

  const isLoading =
    dueQuery.isLoading ||
    membersQuery.isLoading ||
    createDueMutation.isPending ||
    updateDueMutation.isPending;

  if (!permissions.dues.create && !id) {
    return <NotFound />;
  }

  if (!permissions.dues.update && id) {
    return <NotFound />;
  }

  console.log(form.getFieldValue('amount'));

  return (
    <Card
      actions={[
        <Button
          disabled={isLoading}
          icon={<CloseOutlined />}
          onClick={() => navigate(-1)}
          type="link"
        >
          Cancelar
        </Button>,
        <Button
          disabled={isLoading}
          form="form"
          htmlType="submit"
          icon={<SaveOutlined />}
          loading={createDueMutation.isPending || updateDueMutation.isPending}
          type="primary"
        >
          {id ? 'Actualizar cuota' : 'Crear cuota'}
        </Button>,
        !id && (
          <Button
            disabled={isLoading}
            htmlType="button"
            icon={<PlusOutlined />}
            loading={createDueMutation.isPending}
            onClick={() => navigate(APP_ROUTES.DUE_NEW)}
            type="default"
          >
            Crear y volver
          </Button>
        ),
      ]}
      loading={dueQuery.isLoading}
      title={
        <Space>
          <DollarOutlined />
          {dueQuery.isLoading && <Skeleton.Input active />}
          {!dueQuery.isLoading && <>{id ? 'Editar cuota' : 'Nueva cuota'}</>}
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
          <Select
            disabled={!!id}
            loading={membersQuery.isLoading}
            mode={id ? undefined : 'multiple'}
            options={(membersQuery.data ?? []).map((member) => ({
              label: member.name,
              value: member.id,
            }))}
            placeholder="Seleccionar socios"
          />
        </Form.Item>

        <Form.Item<FormSchema>
          label="Categoría"
          name="category"
          rules={[{ message: 'La categoría es requerida', required: true }]}
        >
          <Select
            options={Object.entries(DueCategoryLabel).map(([key, value]) => ({
              label: value,
              value: key,
            }))}
          />
        </Form.Item>

        <Form.Item<FormSchema>
          label="Monto"
          name="amount"
          rules={[{ message: 'El monto es requerido', required: true }]}
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
    </Card>
  );
}
