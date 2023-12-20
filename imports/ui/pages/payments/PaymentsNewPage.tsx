import React, { useEffect } from 'react';
import { App, Breadcrumb, Card, DatePicker, Form, List } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import dayjs, { Dayjs } from 'dayjs';
import { groupBy } from 'lodash';
import { Roles } from 'meteor/alanning:roles';
import { Navigate, NavLink } from 'react-router-dom';
import { CreatePaymentRequestDto } from '@domain/payments/use-cases/create-payment/create-payment-request.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { MoneyUtils } from '@shared/utils/currency.utils';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { FormButtons } from '@ui/components/Form/FormButtons';
import { Select } from '@ui/components/Select';
import { usePendingDues } from '@ui/hooks/dues/usePendingDues';
import { useUpdateDue } from '@ui/hooks/dues/useUpdateDue';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useCreatePayment } from '@ui/hooks/payments/useCreatePayment';
import { PaymentMemberDuesCard } from '@ui/pages/payments/PaymentMemberDuesCard';

type FormDueValue = {
  amount: number;
  dueId: string;
  isSelected: boolean;
};

type FormDuesValue = {
  dues: FormDueValue[];
  memberId: string;
  notes: string | null;
};

type FormValues = {
  date: Dayjs;
  dues: FormDuesValue[];
  memberIds: string[];
};

export const PaymentsNewPage = () => {
  const { message } = App.useApp();

  const [form] = Form.useForm<FormValues>();

  const formMemberIds = useWatch('memberIds', form);

  const { data: pendingDues } = usePendingDues({
    memberIds: formMemberIds ?? [],
  });

  useEffect(() => {
    if (pendingDues) {
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

  const createPayment = useCreatePayment();

  const updateDue = useUpdateDue();

  const { data: members, isLoading: isLoadingMembers } = useMembers();

  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Login} />;
  }

  const handleSubmit = async (values: FormValues) => {
    const request: CreatePaymentRequestDto = {
      date: values.date.format(DateFormatEnum.Date),
      memberDues: values.dues.map((formDuesValue) => ({
        dues: formDuesValue.dues
          .filter((d) => d.isSelected)
          .map((formDueValue) => ({
            amount: MoneyUtils.toCents(formDueValue.amount),
            dueId: formDueValue.dueId,
          })),
        memberId: formDuesValue.memberId,
        notes: formDuesValue.notes,
      })),
    };

    createPayment.mutate(request, {
      onSuccess: () => {
        message.success('Pago creado');

        form.setFieldValue('memberIds', []);
      },
    });
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
          { title: <NavLink to={AppUrl.Dues}>Pagos</NavLink> },
          { title: 'Nuevo Pago' },
        ]}
      />

      <Card>
        <Form<FormValues>
          layout="vertical"
          form={form}
          onFinish={(values) => handleSubmit(values)}
          initialValues={{
            date: DateUtils.c(),
            dues: [],
          }}
        >
          <Form.Item
            name="date"
            label="Fecha"
            rules={[{ required: true }, { type: 'date' }]}
          >
            <DatePicker
              className="w-full"
              disabledDate={(current) => current.isAfter(dayjs())}
            />
          </Form.Item>

          <Form.Item
            label="Socio/s"
            rules={[{ required: true }, { min: 1, type: 'array' }]}
            name="memberIds"
          >
            <Select
              mode="multiple"
              disabled={isLoadingMembers || !canCreatePayment}
              loading={isLoadingMembers}
              options={members?.map((member) => ({
                label: member.name,
                value: member._id,
              }))}
            />
          </Form.Item>

          <List
            grid={{ column: 1 }}
            dataSource={formMemberIds}
            renderItem={(memberId) => (
              <List.Item key={memberId}>
                <PaymentMemberDuesCard
                  memberId={memberId}
                  members={members}
                  pendingDues={pendingDues}
                />
              </List.Item>
            )}
          />

          <FormButtons
            scope={ScopeEnum.Payments}
            isLoading={createPayment.isLoading || updateDue.isLoading}
            isSaveDisabled={createPayment.isLoading || updateDue.isLoading}
            isBackDisabled={createPayment.isLoading || updateDue.isLoading}
            showDeleteButton={false}
          />
        </Form>
      </Card>
    </>
  );
};
