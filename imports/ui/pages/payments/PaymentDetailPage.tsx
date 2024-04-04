import React, { useEffect } from 'react';
import {
  App,
  Breadcrumb,
  Card,
  DatePicker,
  Form,
  InputNumber,
  List,
  Skeleton,
} from 'antd';
import { Rule } from 'antd/es/form';
import { useWatch } from 'antd/es/form/Form';
import dayjs, { Dayjs } from 'dayjs';
import { groupBy } from 'lodash';
import { Roles } from 'meteor/alanning:roles';
import qs from 'qs';
import {
  Navigate,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { CreatePaymentRequestDto } from '@domain/payments/use-cases/create-payment/create-payment-request.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { MoneyUtils } from '@shared/utils/currency.utils';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { UrlUtils } from '@shared/utils/url.utils';
import { AppUrl } from '@ui/app.enum';
import { FormButtons } from '@ui/components/Form/FormButtons';
import { NotFound } from '@ui/components/NotFound';
import { Select } from '@ui/components/Select';
import { usePendingDues } from '@ui/hooks/dues/usePendingDues';
import { useUpdateDue } from '@ui/hooks/dues/useUpdateDue';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useCreatePayment } from '@ui/hooks/payments/useCreatePayment';
import { useDeletePayment } from '@ui/hooks/payments/useDeletePayment';
import { usePayment } from '@ui/hooks/payments/usePayment';
import { useUpdatePayment } from '@ui/hooks/payments/useUpdatePayment';
import { PaymentMemberDuesCard } from '@ui/pages/payments/PaymentMemberDuesCard';

type FormDueValue = {
  amount: number;
  dueId: string;
  isSelected: boolean;
};

type FormDuesValue = {
  dues: FormDueValue[] | undefined;
  memberId: string;
  notes: string | null;
};

type FormValues = {
  date: Dayjs;
  dues: FormDuesValue[];
  memberIds: string | string[];
  receiptNumber: number;
};

export const PaymentDetailPage = () => {
  const { message } = App.useApp();

  const { id } = useParams<{ id?: string }>();

  const navigate = useNavigate();

  const location = useLocation();

  const [, setSearchParams] = useSearchParams();

  const {
    data: payment,
    fetchStatus: paymentFetchStatus,
    refetch,
  } = usePayment(id);

  const parsedQs = qs.parse(location.search, { ignoreQueryPrefix: true });

  const [form] = Form.useForm<FormValues>();

  const formMemberIds = useWatch('memberIds', form);

  const getInitialMemberIds = () => {
    if (payment) {
      return [payment.memberId];
    }

    if (parsedQs.memberIds) {
      return parsedQs.memberIds as string[];
    }

    return [];
  };

  const { data: pendingDues } = usePendingDues({
    memberIds: getInitialMemberIds(),
  });

  const createPayment = useCreatePayment();

  const updatePayment = useUpdatePayment();

  const deletePayment = useDeletePayment(() => {
    message.success('Pago eliminado');

    navigate(AppUrl.Payments);
  });

  const updateDue = useUpdateDue();

  const { data: members, isLoading: isLoadingMembers } = useMembers();

  useEffect(() => {
    if (!payment) {
      setSearchParams(UrlUtils.stringify({ memberIds: formMemberIds }), {
        replace: true,
      });
    }
  }, [formMemberIds, setSearchParams, payment]);

  useEffect(() => {
    if (pendingDues?.length) {
      const groupedDuesByMember = groupBy(pendingDues, 'memberId');

      const formDuesToSet = Object.entries(groupedDuesByMember).map(
        ([memberId, dues]) => ({
          dues: dues.map((due) => ({
            amount: MoneyUtils.fromCents(due.amount),
            dueId: due._id,
            isSelected: true,
          })),
          memberId,
          notes: null,
        })
      );

      form.setFieldValue('dues', formDuesToSet);
    }
  }, [pendingDues, form]);

  useEffect(() => {
    if (payment) {
      form.setFieldsValue({
        date: DateUtils.utc(payment.date, DateFormatEnum.DDMMYYYY),
        dues: [
          {
            dues: payment.dues.map((paymentDue) => ({
              amount: MoneyUtils.fromCents(paymentDue.amount),
              dueId: paymentDue.dueId,
              isSelected: true,
            })),
            memberId: payment.memberId,
            notes: payment.notes,
          },
        ],
        memberIds: [payment.memberId],
      });
    }
  }, [payment, form]);

  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Login} />;
  }

  const isLoading = paymentFetchStatus === 'fetching';

  if (id && !payment && !isLoading) {
    return <NotFound />;
  }

  const handleSubmit = async (values: FormValues) => {
    if (!payment) {
      const request: CreatePaymentRequestDto = {
        date: values.date.format(DateFormatEnum.Date),
        memberDues: values.dues.map((formDuesValue) => ({
          dues:
            formDuesValue.dues
              ?.filter((d) => d.isSelected)
              .map((formDueValue) => ({
                amount: MoneyUtils.toCents(formDueValue.amount),
                dueId: formDueValue.dueId,
              })) ?? [],
          memberId: formDuesValue.memberId,
          notes: formDuesValue.notes,
        })),
        receiptNumber: values.receiptNumber,
      };

      if (request.memberDues.some((d) => d.dues.length === 0)) {
        message.error('Debe seleccionar al menos una cuota');

        return;
      }

      createPayment.mutate(request, {
        onSuccess: () => {
          message.success('Pago creado');

          form.setFieldValue('memberIds', []);
        },
      });
    } else {
      updatePayment.mutate(
        {
          date: values.date.format(DateFormatEnum.Date),
          dues:
            values.dues[0].dues
              ?.filter((d) => d.isSelected)
              .map((formDueValue) => ({
                amount: MoneyUtils.toCents(formDueValue.amount),
                dueId: formDueValue.dueId,
              })) ?? [],
          id: payment._id,
          notes: values.dues[0].notes ?? null,
        },
        {
          onSuccess: () => {
            message.success('Cobro actualizado');

            refetch();
          },
        }
      );
    }
  };

  const getRulesForMemberIds = () => {
    const rules: Rule[] = [
      {
        required: true,
      },
    ];

    if (!payment) {
      rules.push({ min: 1, type: 'array' });
    }

    return rules;
  };

  const canCreatePayment = Roles.userIsInRole(
    user,
    PermissionEnum.Create,
    ScopeEnum.Payments
  );

  const getListDataSource = (): string[] => {
    if (formMemberIds) {
      return Array.isArray(formMemberIds) ? formMemberIds : [formMemberIds];
    }

    return [];
  };

  /**
   * Renders component
   */
  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[
          { title: 'Inicio' },
          { title: <NavLink to={AppUrl.Payments}>Pagos</NavLink> },
          { title: payment ? payment.date : 'Nuevo Pago' },
        ]}
      />

      <Skeleton active loading={isLoading}>
        <Card title={payment ? payment.memberName : 'Nuevo Pago'}>
          <Form<FormValues>
            layout="vertical"
            form={form}
            onFinish={(values) => handleSubmit(values)}
            initialValues={{
              date: DateUtils.c(),
              dues: [],
              memberIds: getInitialMemberIds(),
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

            <Form.Item
              name="receiptNumber"
              label="Comprobante Nro."
              rules={[{ required: true }]}
            >
              <InputNumber min={1} />
            </Form.Item>

            <Form.Item
              label="Socio/s"
              rules={getRulesForMemberIds()}
              name="memberIds"
            >
              <Select
                mode={payment ? undefined : 'multiple'}
                disabled={isLoadingMembers || !canCreatePayment || !!payment}
                loading={isLoadingMembers}
                options={members?.map((member) => ({
                  label: member.name,
                  value: member._id,
                }))}
              />
            </Form.Item>

            {payment && (
              <PaymentMemberDuesCard
                memberId={payment.memberId}
                dues={payment.dues.map((paymentDue) => ({
                  _id: paymentDue.dueId,
                  amount: paymentDue.dueAmount,
                  category: paymentDue.dueCategory,
                  date: paymentDue.dueDate,
                  memberId: payment.memberId,
                  memberName: payment.memberName,
                  membershipMonth: paymentDue.membershipMonth,
                }))}
              />
            )}

            {!payment && (
              <List
                grid={{ column: 1 }}
                dataSource={getListDataSource()}
                renderItem={(memberId) => {
                  const member = members?.find((m) => m._id === memberId);

                  if (!member) {
                    return null;
                  }

                  return (
                    <List.Item key={memberId}>
                      <Card title={member.name}>
                        <PaymentMemberDuesCard
                          memberId={memberId}
                          dues={pendingDues}
                        />
                      </Card>
                    </List.Item>
                  );
                }}
              />
            )}

            <FormButtons
              scope={ScopeEnum.Payments}
              isLoading={
                createPayment.isLoading ||
                updateDue.isLoading ||
                deletePayment.isLoading
              }
              isSaveDisabled={
                createPayment.isLoading ||
                updateDue.isLoading ||
                deletePayment.isLoading
              }
              isBackDisabled={
                createPayment.isLoading ||
                updateDue.isLoading ||
                deletePayment.isLoading
              }
              showDeleteButton={!!payment}
              onClickDelete={() => {
                if (payment) {
                  deletePayment.mutate({ id: payment._id });
                }
              }}
              isDeleteDisabled={
                createPayment.isLoading ||
                updateDue.isLoading ||
                deletePayment.isLoading
              }
            />
          </Form>
        </Card>
      </Skeleton>
    </>
  );
};
