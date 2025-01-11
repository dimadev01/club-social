import {
  HomeOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Card, Col, DatePicker, Form, Input, Row, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import compact from 'lodash/compact';
import uniq from 'lodash/uniq';
import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import {
  MemberCategoryEnum,
  MemberFileStatusEnum,
  MemberMaritalStatusEnum,
  MemberNationalityEnum,
  MemberSexEnum,
  MemberStatusEnum,
  getMemberCategorySelectOptions,
  getMemberFileStatusSelectOptions,
  getMemberMaritalStatusSelectOptions,
  getMemberNationalitySelectOptions,
  getMemberSexSelectOptions,
  getMemberStatusSelectOptions,
} from '@domain/members/member.enum';
import { ScopeEnum } from '@domain/roles/role.enum';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { UrlUtils } from '@shared/utils/url.utils';
import { Breadcrumbs } from '@ui/components/Breadcrumbs/Breadcrumbs';
import { FormButtons } from '@ui/components/Form/FormButtons';
import { FormListEmails } from '@ui/components/Form/FormListEmails';
import { FormListInput } from '@ui/components/Form/FormListInput';
import { Select } from '@ui/components/Select';
import { useCities } from '@ui/hooks/gov/useCities';
import { useStates } from '@ui/hooks/gov/useStates';
import { useCreateMember } from '@ui/hooks/members/useCreateMember';
import { useMember } from '@ui/hooks/members/useMember';
import { useUpdateMember } from '@ui/hooks/members/useUpdateMember';
import { useNotificationSuccess } from '@ui/hooks/ui/useNotification';

type FormValues = {
  address: {
    cityGovId: { label: string; value: string } | undefined;
    stateGovId: { label: string; value: string } | undefined;
    street: string | undefined;
    zipCode: string | undefined;
  };
  birthDate: Dayjs | undefined;
  category: MemberCategoryEnum;
  documentID: string | undefined;
  emails: string[];
  fileStatus: MemberFileStatusEnum | undefined;
  firstName: string;
  lastName: string;
  maritalStatus: MemberMaritalStatusEnum | undefined;
  nationality: MemberNationalityEnum | undefined;
  phones: string[];
  sex: MemberSexEnum | undefined;
  status: MemberStatusEnum;
};

export const MemberDetailPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();

  const notificationSuccess = useNotificationSuccess();

  const location = useLocation();

  const { data: member, fetchStatus: memberFetchStatus } = useMember(
    id ? { id } : undefined,
  );

  const isLoading = memberFetchStatus === 'fetching';

  const [form] = Form.useForm<FormValues>();

  const stateGovId = Form.useWatch(['address', 'stateGovId'], form);

  const navigate = useNavigate();

  const { data: states, isLoading: statesIsLoading } = useStates();

  const { data: cities, fetchStatus: citiesFetchStatus } = useCities(
    stateGovId?.value,
  );

  const createMember = useCreateMember();

  const updateMember = useUpdateMember();

  const handleSubmit = async (values: FormValues) => {
    if (!member) {
      await createMember.mutateAsync(
        {
          addressCityGovId: values.address.cityGovId?.value || null,
          addressCityName: values.address.cityGovId?.label || null,
          addressStateGovId: values.address.stateGovId?.value || null,
          addressStateName: values.address.stateGovId?.label || null,
          addressStreet: values.address.street || null,
          addressZipCode: values.address.zipCode || null,
          birthDate: values.birthDate
            ? DateUtils.format(values.birthDate, DateFormatEnum.DATE)
            : null,
          category: values.category,
          documentID: values.documentID || null,
          emails: compact(values.emails).length > 0 ? values.emails : null,
          fileStatus: values.fileStatus || null,
          firstName: values.firstName,
          lastName: values.lastName,
          maritalStatus: values.maritalStatus || null,
          nationality: values.nationality || null,
          phones: compact(values.phones).length > 0 ? values.phones : null,
          sex: values.sex || null,
        },
        {
          onSuccess: () => {
            notificationSuccess('Socio creado');

            navigate(-1);
          },
        },
      );
    } else {
      await updateMember.mutateAsync(
        {
          addressCityGovId: values.address.cityGovId?.value || null,
          addressCityName: values.address.cityGovId?.label || null,
          addressStateGovId: values.address.stateGovId?.value || null,
          addressStateName: values.address.stateGovId?.label || null,
          addressStreet: values.address.street || null,
          addressZipCode: values.address.zipCode || null,
          birthDate: values.birthDate
            ? DateUtils.format(values.birthDate, DateFormatEnum.DATE)
            : null,
          category: values.category || null,
          documentID: values.documentID || null,
          emails: compact(values.emails).length > 0 ? values.emails : null,
          fileStatus: values.fileStatus || null,
          firstName: values.firstName,
          id: member.id,
          lastName: values.lastName,
          maritalStatus: values.maritalStatus || null,
          nationality: values.nationality || null,
          phones: compact(values.phones).length > 0 ? values.phones : null,
          sex: values.sex || null,
          status: values.status,
        },
        {
          onSuccess: () => {
            notificationSuccess('Socio actualizado');

            navigate(-1);
          },
        },
      );
    }
  };

  return (
    <>
      <Breadcrumbs
        items={[
          {
            title: (
              <Space>
                <TeamOutlined />
                <Link to={`..${UrlUtils.stringify(location.state)}`}>
                  Socios
                </Link>
              </Space>
            ),
          },
          { title: member ? member.name : 'Nuevo Socio' },
        ]}
      />

      <Card
        extra={<TeamOutlined />}
        loading={isLoading}
        title={member ? member.name : 'Nuevo Socio'}
      >
        <Form<FormValues>
          layout="vertical"
          form={form}
          onFinish={(values) => handleSubmit(values)}
          disabled={createMember.isLoading || updateMember.isLoading}
          initialValues={{
            address: {
              cityGovId: member?.addressCityGovId
                ? {
                    label: member.addressCityName,
                    value: member.addressCityGovId,
                  }
                : undefined,
              stateGovId: member?.addressStateGovId
                ? {
                    label: member.addressStateName,
                    value: member.addressStateGovId,
                  }
                : undefined,
              street: member?.addressStreet,
              zipCode: member?.addressZipCode,
            },
            birthDate: member?.birthDate
              ? dayjs.utc(member.birthDate)
              : undefined,
            category: member?.category,
            documentID: member?.documentID,
            emails:
              member?.emails && member.emails.length > 0 ? member.emails : [''],
            fileStatus: member?.fileStatus,
            firstName: member?.firstName,
            lastName: member?.lastName,
            maritalStatus: member?.maritalStatus,
            nationality: member?.nationality,
            phones: member?.phones || [''],
            sex: member?.sex,
            status: member?.status || MemberStatusEnum.ACTIVE,
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Card
                title="Información básica"
                type="inner"
                extra={<IdcardOutlined />}
              >
                <Form.Item
                  name="firstName"
                  label="Nombre"
                  rules={[{ required: true, whitespace: true }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="lastName"
                  label="Apellido"
                  rules={[{ required: true, whitespace: true }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Categoría"
                  name="category"
                  rules={[{ required: true }]}
                >
                  <Select options={getMemberCategorySelectOptions()} />
                </Form.Item>

                <Form.Item
                  name="birthDate"
                  label="Fecha de Nacimiento"
                  rules={[{ type: 'date' }]}
                >
                  <DatePicker
                    format={DateFormatEnum.DDMMYYYY}
                    className="w-full"
                    disabledDate={(current: Dayjs) => current.isAfter(dayjs())}
                  />
                </Form.Item>

                <Form.Item
                  rules={[{ whitespace: true }]}
                  label="DNI"
                  name="documentID"
                >
                  <Input />
                </Form.Item>

                <Form.Item label="Ficha" name="fileStatus">
                  <Select options={getMemberFileStatusSelectOptions()} />
                </Form.Item>

                <Form.Item label="Nacionalidad" name="nationality">
                  <Select options={getMemberNationalitySelectOptions()} />
                </Form.Item>

                <Form.Item label="Género" name="sex">
                  <Select options={getMemberSexSelectOptions()} />
                </Form.Item>

                <Form.Item label="Estado civil" name="maritalStatus">
                  <Select options={getMemberMaritalStatusSelectOptions()} />
                </Form.Item>

                <Form.Item
                  rules={[{ required: true }]}
                  label="Estado"
                  name="status"
                >
                  <Select options={getMemberStatusSelectOptions()} />
                </Form.Item>
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Space size="middle" direction="vertical" className="flex">
                <Card title="Emails" type="inner" extra={<MailOutlined />}>
                  <FormListEmails />
                </Card>

                <Card title="Teléfonos" type="inner" extra={<PhoneOutlined />}>
                  <Form.List
                    name="phones"
                    rules={[
                      {
                        validator: async (_, names) => {
                          if (
                            compact(uniq(names)).length !==
                            compact(names).length
                          ) {
                            return Promise.reject(
                              new Error(
                                'No se pueden ingresar teléfonos duplicados',
                              ),
                            );
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    {(fields, { add, remove }, { errors }) => (
                      <>
                        {fields.map((field, index) => (
                          <Form.Item
                            required={fields.length > 1}
                            label={`Teléfono ${index + 1}`}
                            key={field.key}
                          >
                            <Form.Item
                              {...field}
                              label={`Teléfono ${index + 1}`}
                              rules={[
                                { required: fields.length > 1 },
                                { whitespace: true },
                              ]}
                              noStyle
                            >
                              <FormListInput
                                add={add}
                                remove={remove}
                                fieldName={field.name}
                                index={index}
                              />
                            </Form.Item>
                            <Form.ErrorList
                              className="text-red-500"
                              errors={errors}
                            />
                          </Form.Item>
                        ))}
                      </>
                    )}
                  </Form.List>
                </Card>

                <Card title="Dirección" type="inner" extra={<HomeOutlined />}>
                  <Form.Item name={['address', 'stateGovId']} label="Provincia">
                    <Select
                      onChange={() => {
                        form.setFieldValue(['address', 'cityGovId'], null);
                      }}
                      loading={statesIsLoading}
                      labelInValue
                      options={
                        states?.map((state) => ({
                          label: state.nombre,
                          value: state.id,
                        })) || []
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    dependencies={['address.stateGovId']}
                    name={['address', 'cityGovId']}
                    label="Localidad"
                    rules={[{ required: !!stateGovId?.value }]}
                  >
                    <Select
                      loading={citiesFetchStatus === 'fetching'}
                      labelInValue
                      disabled={!stateGovId}
                      options={
                        cities?.map((city) => ({
                          label: city.nombre,
                          value: city.id,
                        })) || []
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    dependencies={['address', 'cityGovId']}
                    name={['address', 'street']}
                    label="Calle"
                    rules={[{ whitespace: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    dependencies={['address', 'cityGovId']}
                    name={['address', 'zipCode']}
                    label="Código Postal"
                    rules={[{ whitespace: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Card>
              </Space>
            </Col>
          </Row>

          <div className="mb-4" />

          <FormButtons
            saveButtonProps={{
              text: member ? 'Actualizar Socio' : 'Crear Socio',
            }}
            scope={ScopeEnum.MEMBERS}
          />
        </Form>
      </Card>
    </>
  );
};
