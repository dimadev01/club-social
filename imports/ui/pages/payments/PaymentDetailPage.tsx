import React, { useEffect } from 'react';
import {
  App,
  Breadcrumb,
  Card,
  Col,
  DatePicker,
  Form,
  InputNumber,
  Row,
  Skeleton,
} from 'antd';
import { useWatch } from 'antd/es/form/Form';
import dayjs, { Dayjs } from 'dayjs';
import { Roles } from 'meteor/alanning:roles';
import {
  Navigate,
  NavLink,
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
import { usePendingDuesByMember } from '@ui/hooks/dues/usePendingDues';
import { useUpdateDue } from '@ui/hooks/dues/useUpdateDue';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useCreatePayment } from '@ui/hooks/payments/useCreatePayment';
import { useDeletePayment } from '@ui/hooks/payments/useDeletePayment';
import { usePayment } from '@ui/hooks/payments/usePayment';
import { useUpdatePayment } from '@ui/hooks/payments/useUpdatePayment';
import { PaymentMemberDuesCard } from '@ui/pages/payments/PaymentMemberDuesCard';
import { useMember } from '@ui/hooks/members/useMember';

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
  memberId: string;
  receiptNumber: number;
};

export const PaymentDetailPage = () => {
  const { message } = App.useApp();

  const { id: paymentId, memberId } = useParams<{
    id?: string;
    memberId?: string;
  }>();

  const navigate = useNavigate();

  const [, setSearchParams] = useSearchParams();

  const [form] = Form.useForm<FormValues>();

  const formMemberId = useWatch('memberId', form);

  const { data: members, isLoading: isLoadingMembers } = useMembers();

  const {
    data: payment,
    fetchStatus: paymentFetchStatus,
    refetch,
  } = usePayment(paymentId);

  const { data: pendingDues } = usePendingDuesByMember(memberId);

  const { data: member } = useMember(formMemberId);

  const createPayment = useCreatePayment();

  const updatePayment = useUpdatePayment();

  const deletePayment = useDeletePayment(() => {
    message.success('Pago eliminado');

    navigate(AppUrl.Payments);
  });

  const updateDue = useUpdateDue();

  useEffect(() => {
    if (!payment) {
      setSearchParams(UrlUtils.stringify({ memberIds: formMemberId }), {
        replace: true,
      });
    }
  }, [formMemberId, setSearchParams, payment]);

  // useEffect(() => {
  //   if (pendingDues?.length) {
  //     const groupedDuesByMember = groupBy(pendingDues, 'memberId');

  //     const formDuesToSet = Object.entries(groupedDuesByMember).map(
  //       ([memberId, dues]) => ({
  //         dues: dues.map((due) => ({
  //           amount: MoneyUtils.fromCents(due.amount),
  //           dueId: due._id,
  //           isSelected: true,
  //         })),
  //         memberId,
  //         notes: null,
  //       })
  //     );

  //     form.setFieldValue('dues', formDuesToSet);
  //   }
  // }, [pendingDues, form]);

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
        memberId: payment.memberId,
      });
    }
  }, [payment, form]);

  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Login} />;
  }

  const isLoading = paymentFetchStatus === 'fetching';

  if (paymentId && !payment && !isLoading) {
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

  const canCreatePayment = Roles.userIsInRole(
    user,
    PermissionEnum.Create,
    ScopeEnum.Payments
  );

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
              memberId,
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={12} lg={10} xl={8} xxl={6}>
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
                  label="Socio"
                  rules={[{ required: true }]}
                  name="memberId"
                >
                  <Select
                    disabled={
                      isLoadingMembers || !canCreatePayment || !!payment
                    }
                    loading={isLoadingMembers}
                    options={members?.map((m) => ({
                      label: m.name,
                      value: m._id,
                    }))}
                  />
                </Form.Item>

                <Form.Item
                  name="receiptNumber"
                  label="Comprobante Nro."
                  rules={[{ required: true }]}
                >
                  <InputNumber min={1} />
                </Form.Item>
              </Col>
            </Row>

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

            {!payment && member && (
              <Card title={`${member.firstName} ${member.lastName}`}>
                <PaymentMemberDuesCard
                  memberId={member._id}
                  dues={pendingDues}
                />
              </Card>
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
