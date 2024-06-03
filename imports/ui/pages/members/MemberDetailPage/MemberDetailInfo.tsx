import { App, Card, Col, DatePicker, Form, Input, Row, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import compact from 'lodash/compact';
import uniq from 'lodash/uniq';
import { Roles } from 'meteor/alanning:roles';
import React from 'react';
import { Navigate } from 'react-router-dom';

import { MemberDto } from '@application/members/dtos/member.dto';
import {
  MemberCategoryEnum,
  MemberFileStatusEnum,
  MemberMaritalStatusEnum,
  MemberNationalityEnum,
  MemberSexEnum,
  MemberStatusEnum,
  getMemberCategoryOptions,
  getMemberFileStatusOptions,
  getMemberMaritalStatusOptions,
  getMemberNationalityOptions,
  getMemberSexOptions,
  getMemberStatusOptions,
} from '@domain/members/member.enum';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { FormButtons } from '@ui/components/Form/FormButtons';
import { FormListEmails } from '@ui/components/Form/FormListEmails';
import { FormListInput } from '@ui/components/Form/FormListInput';
import { Select } from '@ui/components/Select';
import { useCreateMember } from '@ui/hooks/members/useCreateMember';
import { useUpdateMember } from '@ui/hooks/members/useUpdateMemberNew';
import { useCities } from '@ui/hooks/useCities';
import { useNavigate } from '@ui/hooks/useNavigate';
import { useStates } from '@ui/hooks/useStates';

type FormValues = {
  address: {
    cityGovId: { label: string; value: string } | undefined;
    stateGovId: { label: string; value: string } | undefined;
    street: string | undefined;
    zipCode: string | undefined;
  };
  category: MemberCategoryEnum;
  dateOfBirth: Dayjs | undefined;
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

type Props = {
  member?: MemberDto | null;
};

export const MemberDetailInfo: React.FC<Props> = ({ member }) => {
  const [form] = Form.useForm<FormValues>();

  const { message } = App.useApp();

  const stateGovId = Form.useWatch(['address', 'stateGovId'], form);

  const navigate = useNavigate();

  const { data: states, isLoading: statesIsLoading } = useStates();

  const { data: cities, fetchStatus: citiesFetchStatus } = useCities(
    stateGovId?.value,
  );

  const createMember = useCreateMember();

  const updateMember = useUpdateMember();

  const user = Meteor.user();

  if (!user) {
    return <Navigate to={AppUrl.Login} />;
  }

  const handleSubmit = async (values: FormValues) => {
    if (!member) {
      const response = await createMember.mutateAsync({
        addressCityGovId: values.address.cityGovId?.value || null,
        addressCityName: values.address.cityGovId?.label || null,
        addressStateGovId: values.address.stateGovId?.value || null,
        addressStateName: values.address.stateGovId?.label || null,
        addressStreet: values.address.street || null,
        addressZipCode: values.address.zipCode || null,
        category: values.category,
        dateOfBirth: values.dateOfBirth
          ? DateUtils.format(values.dateOfBirth, DateFormatEnum.DATE)
          : null,
        documentID: values.documentID || null,
        emails: compact(values.emails).length > 0 ? values.emails : null,
        fileStatus: values.fileStatus || null,
        firstName: values.firstName,
        lastName: values.lastName,
        maritalStatus: values.maritalStatus || null,
        nationality: values.nationality || null,
        phones: compact(values.phones).length > 0 ? values.phones : null,
        sex: values.sex || null,
      });

      message.success('Socio creado');

      navigate(`${AppUrl.Members}/${response._id}`);
    } else {
      await updateMember.mutateAsync({
        addressCityGovId: values.address.cityGovId?.value || null,
        addressCityName: values.address.cityGovId?.label || null,
        addressStateGovId: values.address.stateGovId?.value || null,
        addressStateName: values.address.stateGovId?.label || null,
        addressStreet: values.address.street || null,
        addressZipCode: values.address.zipCode || null,
        category: values.category || null,
        dateOfBirth: values.dateOfBirth
          ? DateUtils.format(values.dateOfBirth, DateFormatEnum.DATE)
          : null,
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
      });

      message.success('Socio actualizado');

      navigate(-1);
    }
  };

  return (
    <Card>
      <Form<FormValues>
        layout="vertical"
        disabled={
          !Roles.userIsInRole(user, PermissionEnum.CREATE, ScopeEnum.MEMBERS) ||
          !Roles.userIsInRole(user, PermissionEnum.UPDATE, ScopeEnum.MEMBERS)
        }
        form={form}
        onFinish={(values) => handleSubmit(values)}
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
          category: member?.category,
          dateOfBirth: member?.birthDate
            ? dayjs.utc(member.birthDate)
            : undefined,
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
            <Card title="Datos" type="inner">
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
                <Select options={getMemberCategoryOptions()} />
              </Form.Item>

              <Form.Item
                name="dateOfBirth"
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
                <Select options={getMemberFileStatusOptions()} />
              </Form.Item>

              <Form.Item label="Nacionalidad" name="nationality">
                <Select options={getMemberNationalityOptions()} />
              </Form.Item>

              <Form.Item label="Género" name="sex">
                <Select options={getMemberSexOptions()} />
              </Form.Item>

              <Form.Item label="Estado civil" name="maritalStatus">
                <Select options={getMemberMaritalStatusOptions()} />
              </Form.Item>

              <Form.Item
                rules={[{ required: true }]}
                label="Estado"
                name="status"
              >
                <Select options={getMemberStatusOptions()} />
              </Form.Item>
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Space size="middle" direction="vertical" className="flex">
              <Card title="Emails" type="inner">
                <FormListEmails />
              </Card>

              <Card title="Teléfonos" type="inner">
                <Form.List
                  name="phones"
                  rules={[
                    {
                      validator: async (_, names) => {
                        if (
                          compact(uniq(names)).length !== compact(names).length
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

              <Card title="Dirección" type="inner">
                <Form.Item name={['address', 'stateGovId']} label="Provincia">
                  <Select
                    onChange={() => {
                      form.setFieldValue('address.cityGovId', null);
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
  );
};
