import React from 'react';
import {
  Breadcrumb,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
  Spin,
} from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import dayjs, { Dayjs } from 'dayjs';
import { compact, uniq } from 'lodash';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import {
  MemberCategory,
  MemberCategoryOptions,
  MemberFileStatus,
  MemberFileStatusOptions,
  MemberMaritalStatus,
  MemberMaritalStatusOptions,
  MemberNationality,
  MemberNationalityOptions,
  MemberSex,
  MemberSexOptions,
  MemberStatus,
  MemberStatusOptions,
} from '@domain/members/members.enum';
import { Role } from '@domain/roles/roles.enum';
import { DateFormats, DateUtils } from '@shared/utils/date.utils';
import { AppUrl } from '@ui/app.enum';
import { FormBackButton } from '@ui/components/Form/FormBackButton';
import { FormListEmails } from '@ui/components/Form/FormListEmails';
import { FormListInput } from '@ui/components/Form/FormListInput';
import { FormSaveButton } from '@ui/components/Form/FormSaveButton';
import { NotFound } from '@ui/components/NotFound';
import { useCreateMember } from '@ui/hooks/members/useCreateMember';
import { useMember } from '@ui/hooks/members/useMember';
import { useUpdateMember } from '@ui/hooks/members/useUpdateMember';

type FormValues = {
  category: MemberCategory | undefined;
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

export const MembersDetailPage = () => {
  const { id } = useParams<{ id?: string }>();

  const navigate = useNavigate();

  const { data: member, fetchStatus } = useMember(id);

  const createMember = useCreateMember();

  const updateMember = useUpdateMember();

  const handleSubmit = async (values: FormValues) => {
    if (!member) {
      const memberId = await createMember.mutateAsync({
        category: values.category ?? null,
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
        phones: values.phones,
        role: Role.Member,
        sex: values.sex ?? null,
      });

      message.success('Socio creado');

      navigate(`${AppUrl.Members}/${memberId}`);
    } else {
      await updateMember.mutateAsync({
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
        phones: values.phones,
        role: Role.Member,
        sex: values.sex ?? null,
        status: values.status,
      });

      message.success('Socio actualizado');
    }
  };

  if (fetchStatus === 'fetching') {
    return <Spin spinning />;
  }

  if (id && !member) {
    return <NotFound />;
  }

  return (
    <>
      <Breadcrumb className="mb-8">
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to={AppUrl.Members}>Socios</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {!!member && `${member.firstName} ${member.lastName}`}
          {!member && 'Nuevo Socio'}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card>
        <Form<FormValues>
          layout="vertical"
          onFinish={(values) => handleSubmit(values)}
          initialValues={{
            category: member?.category ?? undefined,
            dateOfBirth: member?.dateOfBirth
              ? dayjs.utc(member.dateOfBirth)
              : undefined,
            emails: member?.emails ?? [''],
            fileStatus: member?.fileStatus ?? undefined,
            firstName: member?.firstName ?? '',
            lastName: member?.lastName ?? '',
            maritalStatus: member?.maritalStatus ?? undefined,
            nationality: member?.nationality ?? undefined,
            phones: member?.phones ?? [''],
            sex: member?.sex ?? undefined,
            status: member?.status ?? undefined,
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="firstName"
                label="Nombre"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Apellido"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Categoría" name="category">
                <Select
                  placeholder="Seleccionar"
                  allowClear
                  options={MemberCategoryOptions()}
                />
              </Form.Item>

              <Form.Item
                name="dateOfBirth"
                label="Fecha de Nacimiento"
                rules={[{ type: 'date' }]}
              >
                <DatePicker
                  format={DateFormats.DD_MM_YYYY}
                  className="w-full"
                  disabledDate={(current: Dayjs) => current.isAfter(dayjs())}
                />
              </Form.Item>

              <FormListEmails />

              {member && (
                <Form.Item label="Estado" name="status">
                  <Select
                    placeholder="Seleccionar"
                    allowClear
                    options={MemberStatusOptions()}
                  />
                </Form.Item>
              )}
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="DNI" name="documentID">
                <Input />
              </Form.Item>

              <Form.Item label="Ficha" name="fileStatus">
                <Select
                  placeholder="Seleccionar"
                  allowClear
                  options={MemberFileStatusOptions()}
                />
              </Form.Item>

              <Form.Item label="Nacionalidad" name="nationality">
                <Select
                  placeholder="Seleccionar"
                  allowClear
                  options={MemberNationalityOptions()}
                />
              </Form.Item>

              <Form.Item label="Género" name="sex">
                <Select
                  placeholder="Seleccionar"
                  allowClear
                  options={MemberSexOptions()}
                />
              </Form.Item>

              <Form.Item label="Estado civil" name="maritalStatus">
                <Select
                  placeholder="Seleccionar"
                  allowClear
                  options={MemberMaritalStatusOptions()}
                />
              </Form.Item>

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
            </Col>
          </Row>

          <ButtonGroup>
            <FormSaveButton />

            <FormBackButton to={AppUrl.Members} />
          </ButtonGroup>
        </Form>
      </Card>
    </>
  );
};
