import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Space,
} from 'antd';
import { useWatch } from 'antd/es/form/Form';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { ScopeEnum } from '@domain/roles/role.enum';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { UrlUtils } from '@shared/utils/url.utils';
import { AppUrl } from '@ui/app.enum';
import { DuesUIUtils } from '@ui/components/Dues/Dues.utils';
import { FormButtons } from '@ui/components/Form/FormButtons';
import { FormInputAmount } from '@ui/components/Form/FormInputAmount';
import { Row } from '@ui/components/Layout/Row';
import { MembersSelect } from '@ui/components/Members/MembersSelect';
import { Select } from '@ui/components/Select';
import { useCreateDue } from '@ui/hooks/dues/useCreateDue';
import { useMembers } from '@ui/hooks/members/useMembers';
import { useNotificationSuccess } from '@ui/hooks/ui/useNotification';

type FormValues = {
  amount: number;
  category: DueCategoryEnum;
  date: Dayjs;
  memberIds: string[] | undefined;
  notes: string | undefined;
};

export const DuesNewPage = () => {
  const notificationSuccess = useNotificationSuccess();

  /**
   * Url params
   */
  const [, setSearchParams] = useSearchParams();

  const {
    memberIds: queryMemberIds,
    date: queryDate,
    category: queryCategory,
    amount: queryAmount,
  } = UrlUtils.parse();

  const urlDate = queryDate ? queryDate.toString() : undefined;

  const urlCategory = queryCategory ? queryCategory.toString() : undefined;

  const urlAmount = queryAmount ? +queryAmount.toString() : undefined;

  const urlMemberIds = useMemo(() => {
    if (!queryMemberIds) {
      return undefined;
    }

    return Array.isArray(queryMemberIds) ? queryMemberIds : [queryMemberIds];
  }, [queryMemberIds]);

  /**
   * Form watches
   */
  const [form] = Form.useForm<FormValues>();

  const formMemberIds: string[] | undefined = useWatch('memberIds', form);

  const formDate: Dayjs | undefined = useWatch('date', form);

  const formCategory: DueCategoryEnum | undefined = useWatch('category', form);

  const formAmount: number | undefined = useWatch('amount', form);

  const formSelectedMemberIds = useMemo(() => formMemberIds, [formMemberIds]);

  /**
   * Hooks
   */
  const { data: members } = useMembers();

  /**
   * Mutations
   */
  const createDue = useCreateDue();

  /**
   * Effects
   */
  useEffect(() => {
    const date = formDate
      ? DateUtils.format(formDate, DateFormatEnum.DATE)
      : undefined;

    setSearchParams(
      UrlUtils.stringify({
        amount: formAmount,
        category: formCategory,
        date,
        memberIds: formSelectedMemberIds,
      }),
      { replace: true },
    );
  }, [
    formDate,
    formAmount,
    formCategory,
    formSelectedMemberIds,
    setSearchParams,
  ]);

  const handleSubmit = async (values: FormValues) => {
    let date: string;

    if (values.category === DueCategoryEnum.MEMBERSHIP) {
      date = new DateTimeVo(values.date)
        .startOf('month')
        .format(DateFormatEnum.DATE);
    } else {
      date = new DateTimeVo(values.date)
        .startOf('day')
        .format(DateFormatEnum.DATE);
    }

    createDue.mutate(
      {
        amount: Money.fromNumber(values.amount).value,
        category: values.category,
        date,
        memberIds: Array.isArray(values.memberIds) ? values.memberIds : [],
        notes: values.notes || null,
      },
      {
        onSuccess: () => {
          notificationSuccess('Deuda creada');

          form.setFieldValue('memberIds', []);

          form.setFieldValue('notes', undefined);
        },
      },
    );
  };

  /**
   * Render helpers
   */
  const renderCardTitle = () => {
    let title = 'Nuevo Deuda';

    if (formDate) {
      title += ` del ${formDate.format(DateFormatEnum.DDMMYYYY)}`;
    }

    return title;
  };

  const renderMemberDropdown = (menu: React.ReactElement) => (
    <>
      {menu}

      {formCategory === DueCategoryEnum.MEMBERSHIP && (
        <Space className="my-1 flex justify-center">
          <Button
            htmlType="button"
            size="small"
            onClick={() => {
              form.setFieldValue(
                'memberIds',
                members
                  ?.filter(
                    (member) =>
                      member.category === MemberCategoryEnum.MEMBER &&
                      member.status === MemberStatusEnum.ACTIVE,
                  )
                  .map((member) => member.id) ?? [],
              );
            }}
          >
            Seleccionar todos los socios
          </Button>

          <Button
            htmlType="button"
            size="small"
            onClick={() => {
              form.setFieldValue(
                'memberIds',
                members
                  ?.filter(
                    (member) =>
                      member.category === MemberCategoryEnum.CADET &&
                      member.status === MemberStatusEnum.ACTIVE,
                  )
                  .map((member) => member.id) ?? [],
              );
            }}
          >
            Seleccionar todos los cadetes
          </Button>
        </Space>
      )}
    </>
  );

  /**
   * Component
   */
  return (
    <>
      <Breadcrumb
        className="mb-4"
        items={[
          { title: 'Inicio' },
          { title: <Link to={AppUrl.DUES}>Deudas</Link> },
          { title: renderCardTitle() },
        ]}
      />

      <Card>
        <Form<FormValues>
          layout="vertical"
          disabled={createDue.isLoading}
          form={form}
          onFinish={(values) => handleSubmit(values)}
          initialValues={{
            amount: urlAmount ?? 0,
            category: urlCategory ?? DueCategoryEnum.ELECTRICITY,
            date: urlDate ? dayjs(urlDate) : DateUtils.c(),
            memberIds: urlMemberIds ?? [],
            notes: undefined,
          }}
        >
          <Row>
            <Col xs={12} sm={8} md={8} lg={6} xl={4}>
              <Form.Item
                name="date"
                label="Fecha"
                rules={[{ required: true }, { type: 'date' }]}
              >
                <DatePicker
                  picker={
                    formCategory === DueCategoryEnum.MEMBERSHIP
                      ? 'month'
                      : 'date'
                  }
                  allowClear={false}
                  format={
                    formCategory === DueCategoryEnum.MEMBERSHIP
                      ? DateFormatEnum.MMMM_YYYY
                      : DateFormatEnum.DDMMYYYY
                  }
                  className="w-full"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Socio/s"
            name="memberIds"
            rules={[{ min: 1, required: true, type: 'array' }]}
          >
            <MembersSelect
              dropdownRender={renderMemberDropdown}
              mode="multiple"
            />
          </Form.Item>

          <Row>
            <Col xs={12} sm={8} md={8} lg={6} xl={4}>
              <Form.Item
                label="Categoría"
                name="category"
                rules={[{ required: true }]}
              >
                <Select
                  onChange={() => {
                    form.setFieldValue('amount', 0);
                  }}
                  options={DuesUIUtils.getCategorySelectOptions()}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xs={12} sm={8} md={8} lg={6} xl={4}>
              <Form.Item
                label="Importe"
                name="amount"
                rules={[{ required: true }, { min: 1, type: 'number' }]}
              >
                <FormInputAmount />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Notas" rules={[{ whitespace: true }]} name="notes">
            <Input.TextArea rows={1} />
          </Form.Item>

          <FormButtons
            saveButtonProps={{
              loading: createDue.isLoading,
              text: 'Registrar Deuda',
            }}
            scope={ScopeEnum.DUES}
          />
        </Form>
      </Card>
    </>
  );
};
