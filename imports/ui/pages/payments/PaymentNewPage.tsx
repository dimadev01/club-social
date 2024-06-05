import { Breadcrumb, Card, Col, DatePicker, Form, InputNumber } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import dayjs, { Dayjs } from 'dayjs';
import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { PaymentPendingDuesTable } from './PaymentPendingDuesTable';

import { CreatePaymentRequestDto } from '@adapters/dtos/create-payment-request.dto';
import { DueDto } from '@application/dues/dtos/due.dto';
import { Money } from '@domain/common/value-objects/money.value-object';
import { ScopeEnum } from '@domain/roles/role.enum';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { UrlUtils } from '@shared/utils/url.utils';
import { AppUrl } from '@ui/app.enum';
import { FormButtons } from '@ui/components/Form/FormButtons';
import { Row } from '@ui/components/Layout/Row';
import { MembersSelect } from '@ui/components/Members/MembersSelect';
import { usePendingDuesByMember } from '@ui/hooks/dues/usePendingDuesByMember';
import { useMember } from '@ui/hooks/members/useMember';
import { useCreatePayment } from '@ui/hooks/payments/useCreatePayment';
import { useNavigate } from '@ui/hooks/useNavigate';
import {
  useNotificationError,
  useNotificationSuccess,
} from '@ui/hooks/useNotification';

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
          amount: new Money({ amount: due.amount }).toInteger(),
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
      date: values.date.format(DateFormatEnum.DATE),
      dues: selectedDues.map((due) => ({
        amount: Money.fromNumber(due.amount).value,
        dueId: due.dueId,
      })),
      memberId: values.memberId,
      notes: values.notes ?? null,
      receiptNumber: values.receiptNumber,
    };

    createPayment.mutate(request, {
      onSuccess: () => {
        notificationSuccess('Pago registrado');

        form.setFieldsValue({
          dues: undefined,
          memberId: undefined,
          notes: undefined,
          receiptNumber: undefined,
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
        className="mb-8"
        items={[
          { title: 'Inicio' },
          { title: <Link to={AppUrl.Payments}>Pagos</Link> },
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
            date: urlDate ? dayjs(urlDate) : DateUtils.c(),
            dues: urlDueIds?.map((dueId) => ({
              amount: 0,
              dueId,
              isSelected: true,
            })),
            memberId: urlMemberId,
            receiptNumber: undefined,
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
                {/* <Space.Compact className="flex">
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() =>
                      navigate(
                        UrlUtils.navigate(AppUrl.DuesNew, {
                          memberIds: [formMemberId],
                        }),
                      )
                    }
                    tooltip={{ title: 'Agregar cobro' }}
                  />
                </Space.Compact> */}
              </Form.Item>
            </Col>
          </Row>

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

          <FormButtons
            scope={ScopeEnum.PAYMENTS}
            saveButtonProps={{ text: 'Registrar Pago' }}
          />
        </Form>
      </Card>
    </>
  );
};
