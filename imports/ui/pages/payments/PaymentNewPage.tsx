import React, { useEffect, useMemo } from 'react';
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
import { Navigate, NavLink, useSearchParams } from 'react-router-dom';
import { CreatePaymentRequestDto } from '@domain/payments/use-cases/create-payment/create-payment-request.dto';
import { ScopeEnum } from '@domain/roles/role.enum';
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
import { MoneyUtils } from '@shared/utils/money.utils';
import { Button } from '@ui/components/Button';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { useNextPaymentReceiptNumber } from '@ui/hooks/payments/useNextPaymentReceiptNumber';
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
  const { message, notification } = App.useApp();

  /**
   * Url params
   */
  const [, setSearchParams] = useSearchParams();

  const {
    memberId: queryMemberId,
    date: queryDate,
    receiptNumber: queryReceiptNumber,
    dueIds: queryDueIds,
  } = UrlUtils.parse();

  const urlMemberId = queryMemberId ? queryMemberId.toString() : undefined;

  const urlDate = queryDate ? queryDate.toString() : undefined;

  const urlReceiptNumber = queryReceiptNumber ? +queryReceiptNumber : undefined;

  const urlDueIds = useMemo(() => {
    if (!queryDueIds) {
      return undefined;
    }

    return Array.isArray(queryDueIds) ? queryDueIds : [queryDueIds];
  }, [queryDueIds]);

  /**
   * Form watches
   */
  const [form] = Form.useForm<FormValues>();

  const formMemberId: string | undefined = useWatch('memberId', form);

  const formDate: Dayjs | undefined = useWatch('date', form);

  const formReceiptNumber: number | undefined = useWatch('receiptNumber', form);

  const formDues: FormDueValue[] | undefined = useWatch('dues', form);

  const formDuesSelectedIds =
    formDues?.filter((d) => d.isSelected).map((d) => d.dueId) ?? [];

  /**
   * Hooks
   */
  const { data: members, isLoading: isLoadingMembers } = useMembers();

  const { data: pendingDues } = usePendingDuesByMember(formMemberId);

  const { data: member } = useMember(formMemberId);

  const { data: nextPaymentReceiptNumber } = useNextPaymentReceiptNumber(
    !urlReceiptNumber && !formReceiptNumber,
  );

  /**
   * Mutations
   */
  const createPayment = useCreatePayment();

  useDeepCompareEffect(() => {
    const date = formDate
      ? DateUtils.format(formDate, DateFormatEnum.Date)
      : undefined;

    setSearchParams(
      UrlUtils.stringify({
        date,
        dueIds: formDuesSelectedIds,
        memberId: formMemberId,
        receiptNumber: formReceiptNumber,
      }),
      { replace: true },
    );
  }, [formDate, formMemberId, formReceiptNumber, formDuesSelectedIds]);

  /**
   * Effects
   */
  useDeepCompareEffect(() => {
    if (pendingDues && pendingDues.length > 0) {
      form.setFieldsValue({
        dues: pendingDues.map((due) => ({
          amount: MoneyUtils.fromCents(due.amount),
          dueId: due._id,
          isSelected: formDuesSelectedIds?.includes(due._id),
        })),
      });
    }
  }, [pendingDues, form, formDuesSelectedIds]);

  useEffect(() => {
    if (nextPaymentReceiptNumber) {
      form.setFieldsValue({
        receiptNumber: nextPaymentReceiptNumber.receiptNumber,
      });
    }
  }, [nextPaymentReceiptNumber, form]);

  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Login} />;
  }

  /**
   * Handlers
   */
  const handleSubmit = async (values: FormValues) => {
    const selectedDues = values.dues.filter((due) => due.isSelected);

    if (selectedDues.length === 0) {
      notification.error({ message: 'Debe seleccionar al menos una deuda' });

      return;
    }

    const request: CreatePaymentRequestDto = {
      date: values.date.format(DateFormatEnum.Date),
      dues: selectedDues.map((due) => ({
        amount: MoneyUtils.toCents(due.amount),
        dueId: due.dueId,
      })),
      memberId: values.memberId,
      notes: values.notes ?? null,
      receiptNumber: values.receiptNumber,
    };

    createPayment.mutate(request, {
      onSuccess: () => {
        message.success('Pago creado');

        form.setFieldValue('memberIds', []);
      },
    });
  };

  /**
   * Render helpers
   */
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
   * Component
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
          disabled={createPayment.isLoading}
          onFinish={(values) => handleSubmit(values)}
          initialValues={{
            date: urlDate ? dayjs(urlDate as string) : DateUtils.c(),
            dues: urlDueIds?.map((dueId) => ({
              amount: 0,
              dueId,
              isSelected: true,
            })),
            memberId: urlMemberId,
            receiptNumber: urlReceiptNumber ? +urlReceiptNumber : undefined,
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
                  allowClear={false}
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
                  loading={isLoadingMembers}
                  options={members?.map((m) => ({
                    label: m.name,
                    value: m._id,
                  }))}
                />
              </Form.Item>

              <Form.Item
                name="receiptNumber"
                label="Recibo Nro."
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
            saveButtonProps={{ text: 'Registrar Pago' }}
          />
        </Form>
      </Card>
    </>
  );
};
