import React from 'react';
import { Card, Col, DatePicker, Form, Input, message, Row, Space } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import dayjs, { Dayjs } from 'dayjs';
import compact from 'lodash/compact';
import uniq from 'lodash/uniq';
import { useNavigate } from 'react-router-dom';
import {
  getMemberCategoryOptions,
  getMemberFileStatusOptions,
  getMemberMaritalStatusOptions,
  getMemberNationalityOptions,
  getMemberSexOptions,
  getMemberStatusOptions,
  MemberCategory,
  MemberFileStatus,
  MemberMaritalStatus,
  MemberNationality,
  MemberSex,
  MemberStatus,
} from '@domain/members/members.enum';
import { GetMemberResponseDto } from '@domain/members/use-cases/get-member/get-member-response.dto';
import { Role } from '@domain/roles/roles.enum';
import { DateFormatEnum, DateUtils } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { FormBackButton } from '@ui/components/Form/FormBackButton';
import { FormListEmails } from '@ui/components/Form/FormListEmails';
import { FormListInput } from '@ui/components/Form/FormListInput';
import { FormSaveButton } from '@ui/components/Form/FormSaveButton';
import { Select } from '@ui/components/Select';
import { useCreateMember } from '@ui/hooks/members/useCreateMember';
import { useUpdateMember } from '@ui/hooks/members/useUpdateMember';
import { useCities } from '@ui/hooks/useCities';
import { useStates } from '@ui/hooks/useStates';

type FormValues = {
  address: {
    cityGovId: { label: string; value: string } | undefined;
    stateGovId: { label: string; value: string } | undefined;
    street: string | undefined;
    zipCode: string | undefined;
  };
  category: MemberCategory;
  dateOfBirth: Dayjs | undefined;
  documentID: string | undefined;
  emails: string[];
  fileStatus: MemberFileStatus | undefined;
  firstName: string;
  lastName: string;
  maritalStatus: MemberMaritalStatus | undefined;
  nationality: MemberNationality | undefined;
  phones: string[];
  sex: MemberSex | undefined;
  status: MemberStatus;
};

type Props = {
  member?: GetMemberResponseDto;
};

export const MemberDetailInfo: React.FC<Props> = ({ member }) => {
  const [form] = Form.useForm<FormValues>();

  const stateGovId = Form.useWatch(['address', 'stateGovId'], form);

  const navigate = useNavigate();

  const { data: states, isLoading: statesIsLoading } = useStates();

  const { data: cities, fetchStatus: citiesFetchStatus } = useCities(
    stateGovId?.value
  );

  const createMember = useCreateMember();

  const updateMember = useUpdateMember();

  const handleSubmit = async (values: FormValues) => {
    if (!member) {
      const memberId = await createMember.mutateAsync({
        addressCityGovId: values.address.cityGovId?.value ?? null,
        addressCityName: values.address.cityGovId?.label ?? null,
        addressStateGovId: values.address.stateGovId?.value ?? null,
        addressStateName: values.address.stateGovId?.label ?? null,
        addressStreet: values.address.street ?? null,
        addressZipCode: values.address.zipCode ?? null,
        category: values.category,
        dateOfBirth: values.dateOfBirth
          ? DateUtils.format(values.dateOfBirth)
          : null,
        documentID: values.documentID ?? null,
        emails: compact(values.emails).length > 0 ? values.emails : null,
        fileStatus: values.fileStatus ?? null,
        firstName: values.firstName,
        lastName: values.lastName,
        maritalStatus: values.maritalStatus ?? null,
        nationality: values.nationality ?? null,
        phones: compact(values.phones).length > 0 ? values.phones : null,
        role: Role.Member,
        sex: values.sex ?? null,
        status: MemberStatus.Active,
      });

      message.success('Socio creado');

      navigate(`${AppUrl.Members}/${memberId}`);
    } else {
      await updateMember.mutateAsync({
        addressCityGovId: values.address.cityGovId?.value ?? null,
        addressCityName: values.address.cityGovId?.label ?? null,
        addressStateGovId: values.address.stateGovId?.value ?? null,
        addressStateName: values.address.stateGovId?.label ?? null,
        addressStreet: values.address.street ?? null,
        addressZipCode: values.address.zipCode ?? null,
        category: values.category ?? null,
        dateOfBirth: values.dateOfBirth
          ? DateUtils.format(values.dateOfBirth)
          : null,
        documentID: values.documentID ?? null,
        emails: compact(values.emails).length > 0 ? values.emails : null,
        fileStatus: values.fileStatus ?? null,
        firstName: values.firstName,
        id: member._id,
        lastName: values.lastName,
        maritalStatus: values.maritalStatus ?? null,
        nationality: values.nationality ?? null,
        phones: compact(values.phones).length > 0 ? values.phones : null,
        role: Role.Member,
        sex: values.sex ?? null,
        status: values.status,
      });

      message.success('Socio actualizado');
    }
  };

  return (
    <Card>
      <Form<FormValues>
        layout="vertical"
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
          dateOfBirth: member?.dateOfBirth
            ? dayjs.utc(member.dateOfBirth)
            : undefined,
          documentID: member?.documentID,
          emails:
            member?.emails && member.emails.length > 0 ? member.emails : [''],
          fileStatus: member?.fileStatus,
          firstName: member?.firstName,
          lastName: member?.lastName,
          maritalStatus: member?.maritalStatus,
          nationality: member?.nationality,
          phones: member?.phones ?? [''],
          sex: member?.sex,
          status: member?.status ?? MemberStatus.Active,
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
                  format={DateFormatEnum.DD_MM_YYYY}
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
                              'No se pueden ingresar teléfonos duplicados'
                            )
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
                      form.setFieldValue('address.cityGovId', undefined);
                    }}
                    loading={statesIsLoading}
                    labelInValue
                    options={
                      states?.map((state) => ({
                        label: state.nombre,
                        value: state.id,
                      })) ?? []
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
                      })) ?? []
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

        <ButtonGroup>
          <FormSaveButton
            loading={createMember.isLoading || updateMember.isLoading}
            disabled={createMember.isLoading || updateMember.isLoading}
          />

          <FormBackButton
            disabled={createMember.isLoading || updateMember.isLoading}
          />
        </ButtonGroup>
      </Form>
    </Card>
  );
};
