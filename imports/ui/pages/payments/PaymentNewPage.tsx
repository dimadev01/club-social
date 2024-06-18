import {
  Breadcrumb,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  InputNumber,
} from 'antd';
import { useWatch } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import dayjs, { Dayjs } from 'dayjs';
import React, { useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { PaymentPendingDuesTable } from './PaymentPendingDuesTable';

import { DueDto } from '@application/dues/dtos/due.dto';
import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { ScopeEnum } from '@domain/roles/role.enum';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { UrlUtils } from '@shared/utils/url.utils';
import { AppUrl } from '@ui/app.enum';
import { Button } from '@ui/components/Button/Button';
import { FormButtons } from '@ui/components/Form/FormButtons';
import { AddNewIcon } from '@ui/components/Icons/AddNewIcon';
import { Row } from '@ui/components/Layout/Row';
import { MembersSelect } from '@ui/components/Members/MembersSelect';
import { CreatePaymentDueRequestDto } from '@ui/dtos/create-payment-due-request.dto';
import { CreatePaymentRequestDto } from '@ui/dtos/create-payment-request.dto';
import { usePendingDuesByMember } from '@ui/hooks/dues/usePendingDuesByMember';
import { useMember } from '@ui/hooks/members/useMember';
import { useCreatePayment } from '@ui/hooks/payments/useCreatePayment';
import {
  useNotificationError,
  useNotificationSuccess,
} from '@ui/hooks/ui/useNotification';

type FormDueValue = {
  amount: number;
  dueId: string;
  isSelected: boolean;
};

type FormValues = {
  date: Dayjs;
  dues?: FormDueValue[];
  memberId: string;
  notes: string | null;
  receiptNumber: number;
  sendEmail: boolean;
};

export const PaymentNewPage = () => {
  const notificationError = useNotificationError();

  const notificationSuccess = useNotificationSuccess();

  const navigate = useNavigate();

  /**
   * Url params
   */
  const [, setSearchParams] = useSearchParams();

  const {
    memberId: queryMemberId,
    date: queryDate,
    dueIds: queryDueIds,
  } = UrlUtils.parse();

  const urlMemberId = queryMemberId ? queryMemberId.toString() : undefined;

  const urlDate = queryDate ? queryDate.toString() : undefined;

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
  const { data: pendingDues } = usePendingDuesByMember(
    formMemberId ? { memberId: formMemberId } : undefined,
  );

  const { data: member } = useMember(
    formMemberId ? { id: formMemberId } : undefined,
  );

  /**
   * Mutations
   */
  const createPayment = useCreatePayment();

  /**
   * Effects
   */

  useDeepCompareEffect(() => {
    const date = formDate
      ? DateUtils.format(formDate, DateFormatEnum.DATE)
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

  useDeepCompareEffect(() => {
    if (pendingDues && pendingDues.length > 0) {
      form.setFieldsValue({
        dues: pendingDues.map((due: DueDto) => ({
          amount: new Money({ amount: due.totalPendingAmount }).toInteger(),
          dueId: due.id,
          isSelected: formDuesSelectedIds?.includes(due.id),
        })),
      });
    }
  }, [pendingDues, form, formDuesSelectedIds]);

  /**
   * Handlers
   */
  const handleSubmit = async (values: FormValues) => {
    const selectedDues = values.dues?.filter((due) => due.isSelected) ?? [];

    if (selectedDues.length === 0) {
      notificationError('Debes seleccionar al menos un pago pendiente');

      return;
    }

    const request: CreatePaymentRequestDto = {
      date: new DateTimeVo(values.date).format(DateFormatEnum.DATE),
      dues: selectedDues.map<CreatePaymentDueRequestDto>((due) => ({
        // creditAmount: 100000,
        creditAmount: 0,
        directAmount: Money.fromNumber(due.amount).value,
        dueId: due.dueId,
      })),
      memberId: values.memberId,
      notes: values.notes || null,
      receiptNumber: values.receiptNumber,
      sendEmail: values.sendEmail,
    };

    createPayment.mutate(request, {
      onSuccess: () => {
        notificationSuccess('Pago registrado');

        form.setFieldsValue({
          dues: undefined,
          memberId: undefined,
          notes: undefined,
          receiptNumber: undefined,
          sendEmail: true,
        });
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
        title += ` a ${member.firstName} ${member.lastName}`;
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
      return `Recibo #${formReceiptNumber}`;
    }

    return null;
  };

  /**
   * Component
   */
  return (
    <>
      <Breadcrumb
        className="mb-4"
        items={[
          { title: 'Inicio' },
          { title: <Link to={AppUrl.PAYMENTS}>Pagos</Link> },
          { title: renderCardTitle() },
        ]}
      />

      <Card title={renderCardTitle()} extra={renderCardExtra()}>
        <Form<FormValues>
          layout="vertical"
          form={form}
          scrollToFirstError
          disabled={createPayment.isLoading}
          onFinish={(values) => handleSubmit(values)}
          initialValues={{
            date: urlDate ? dayjs(urlDate) : DateUtils.c(),
            dues: urlDueIds?.map((dueId) => ({
              amount: 0,
              dueId,
              isSelected: true,
            })),
            memberId: urlMemberId,
            receiptNumber: undefined,
            sendEmail: true,
          }}
        >
          <Row>
            <Col xs={12} sm={12} md={10} lg={8} xl={6}>
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
            </Col>
          </Row>

          <Row>
            <Col xs={12} sm={12} md={10} lg={8} xl={6}>
              <Form.Item
                label="Socio"
                rules={[{ required: true }]}
                name="memberId"
              >
                <MembersSelect />
              </Form.Item>
            </Col>
          </Row>

          {formMemberId && (
            <Row className="mb-6">
              <Col xs={12} sm={12} md={10} lg={8} xl={6}>
                <Button
                  onClick={() =>
                    navigate(
                      `${AppUrl.DUES}/new/${UrlUtils.stringify({ memberIds: [formMemberId] })}`,
                    )
                  }
                  icon={<AddNewIcon />}
                >
                  Nueva Deuda
                </Button>
              </Col>
            </Row>
          )}

          <Row>
            <Col xs={6} sm={6} md={5} lg={4} xl={3}>
              <Form.Item
                name="receiptNumber"
                label="Recibo #"
                rules={[{ required: true }, { type: 'number' }]}
              >
                <InputNumber className="w-full" min={1} />
              </Form.Item>
            </Col>
          </Row>

          <PaymentPendingDuesTable pendingDues={pendingDues} />

          <Form.Item label="Notas" rules={[{ whitespace: true }]} name="notes">
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item
            label="Enviar correo electrónico"
            name="sendEmail"
            layout="horizontal"
            valuePropName="checked"
            rules={[{ required: true }]}
          >
            <Checkbox />
          </Form.Item>

          <FormButtons
            scope={ScopeEnum.PAYMENTS}
            saveButtonProps={{
              loading: createPayment.isLoading,
              text: 'Registrar Pago',
            }}
          />
        </Form>
      </Card>
    </>
  );
};
