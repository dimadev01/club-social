import React, { useEffect } from 'react';
import {
  App,
  Breadcrumb,
  Card,
  Col,
  DatePicker,
  Flex,
  Form,
  InputNumber,
  Row,
} from 'antd';
import { useWatch } from 'antd/es/form/Form';
import dayjs, { Dayjs } from 'dayjs';
import { Roles } from 'meteor/alanning:roles';
import { Navigate, NavLink, useSearchParams } from 'react-router-dom';
import { CreatePaymentRequestDto } from '@domain/payments/use-cases/create-payment/create-payment-request.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { FormButtons } from '@ui/components/Form/FormButtons';
import { Select } from '@ui/components/Select';
import { usePendingDuesByMember } from '@ui/hooks/dues/usePendingDues';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useCreatePayment } from '@ui/hooks/payments/useCreatePayment';
import { useMember } from '@ui/hooks/members/useMember';
import { UrlUtils } from '@shared/utils/url.utils';
import TextArea from 'antd/es/input/TextArea';
import { MoneyUtils } from '@shared/utils/currency.utils';
import { Button } from '@ui/components/Button';
import { PaymentPendingDuesTable } from './PaymentPendingDuesTable';

type FormDueValue = {
  amount: number;
  dueId: string;
  isSelected: boolean;
};

type FormValues = {
  date: Dayjs;
  dues: FormDueValue[];
  memberId: string;
  notes: string | null;
  receiptNumber: number;
};

export const PaymentNewPage = () => {
  const { message } = App.useApp();

  const [, setSearchParams] = useSearchParams();

  const [form] = Form.useForm<FormValues>();

  const {
    memberId: urlMemberId,
    date: urlDate,
    receiptNumber: urlReceiptNumber,
  } = UrlUtils.parse();

  const formMemberId: string | undefined = useWatch('memberId', form);

  const formDate: Dayjs | undefined = useWatch('date', form);

  const formReceiptNumber: number | undefined = useWatch('receiptNumber', form);

  const { data: members, isLoading: isLoadingMembers } = useMembers();

  const { data: pendingDues } = usePendingDuesByMember(formMemberId);

  const { data: member } = useMember(formMemberId);

  const createPayment = useCreatePayment();

  useEffect(() => {
    setSearchParams(
      UrlUtils.stringify({
        date: formDate
          ? DateUtils.format(formDate, DateFormatEnum.Date)
          : undefined,
        memberId: formMemberId,
        receiptNumber: formReceiptNumber,
      }),
      {
        replace: true,
      }
    );
  }, [formMemberId, setSearchParams, formDate, formReceiptNumber]);

  useEffect(() => {
    if (pendingDues && pendingDues.length > 0) {
      form.setFieldsValue({
        dues: pendingDues.map((due) => ({
          amount: MoneyUtils.fromCents(due.amount),
          dueId: due._id,
          isSelected: false,
        })),
      });
    }
  }, [pendingDues, form]);

  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Login} />;
  }

  const handleSubmit = async (values: FormValues) => {
    const request: CreatePaymentRequestDto = {
      date: values.date.format(DateFormatEnum.Date),
      memberDues: [],
      //  values.dues.map((formDuesValue) => ({
      //   dues:
      //     formDuesValue.dues
      //       ?.filter((d) => d.isSelected)
      //       .map((formDueValue) => ({
      //         amount: MoneyUtils.toCents(formDueValue.amount),
      //         dueId: formDueValue.dueId,
      //       })) ?? [],
      //   memberId: formDuesValue.memberId,
      //   notes: formDuesValue.notes,
      // })),
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
  };

  const canCreatePayment = Roles.userIsInRole(
    user,
    PermissionEnum.Create,
    ScopeEnum.Payments
  );

  const renderCardTitle = () => {
    if (member || formDate) {
      let title = 'Nuevo Pago';

      if (member) {
        title += ` a ${member.name}`;
      }

      if (formDate) {
        title += ` del ${formDate.format(DateFormatEnum.DDMMYYYY)}`;
      }

      return title;
    }

    return 'Nuevo Pago';
  };

  const renderCardExtra = () => {
    if (formReceiptNumber) {
      return `Recibo Nro. ${formReceiptNumber}`;
    }

    return null;
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
          { title: renderCardTitle() },
        ]}
      />

      <Card title={renderCardTitle()} extra={renderCardExtra()}>
        <Form<FormValues>
          layout="vertical"
          form={form}
          onFinish={(values) => handleSubmit(values)}
          initialValues={{
            date: urlDate ? dayjs(urlDate as string) : DateUtils.c(),
            dues: [],
            memberId: urlMemberId,
            receiptNumber: urlReceiptNumber,
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
                extra={
                  <Flex justify="end">
                    <Button type="link" size="small">
                      <NavLink to={AppUrl.DuesNew}>Nuevo cobro</NavLink>
                    </Button>
                  </Flex>
                }
              >
                <Select
                  disabled={isLoadingMembers || !canCreatePayment}
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
                rules={[{ required: true }, { type: 'number' }]}
              >
                <InputNumber min={1} />
              </Form.Item>
            </Col>
          </Row>

          <PaymentPendingDuesTable pendingDues={pendingDues} />

          <Form.Item label="Notas" rules={[{ whitespace: true }]} name="notes">
            <TextArea />
          </Form.Item>

          <FormButtons
            scope={ScopeEnum.Payments}
            isLoading={createPayment.isLoading}
            isSaveDisabled={createPayment.isLoading}
            isBackDisabled={createPayment.isLoading}
            isDeleteDisabled={createPayment.isLoading}
          />
        </Form>
      </Card>
    </>
  );
};
