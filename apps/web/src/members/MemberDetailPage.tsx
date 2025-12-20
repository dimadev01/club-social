import type { ParamId } from '@club-social/shared/types';

import { DeleteOutlined } from '@ant-design/icons';
import {
  FileStatus,
  FileStatusLabel,
  type ICreateMemberDto,
  type IUpdateMemberDto,
  MaritalStatus,
  MaritalStatusLabel,
  MemberCategory,
  MemberCategoryLabel,
  MemberNationality,
  MemberNationalityLabel,
  MemberSex,
  MemberSexLabel,
} from '@club-social/shared/members';
import { UserStatus, UserStatusLabel } from '@club-social/shared/users';
import { useQueryClient } from '@tanstack/react-query';
import {
  App,
  Button,
  Col,
  DatePicker,
  Empty,
  Input,
  Space,
  Tooltip,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { APP_ROUTES } from '@/app/app.enum';
import { useMutation } from '@/shared/hooks/useMutation';
import { DateFormat } from '@/shared/lib/date-format';
import { $fetch } from '@/shared/lib/fetch';
import { Card } from '@/ui/Card/Card';
import { Form } from '@/ui/Form/Form';
import { AddNewIcon } from '@/ui/Icons/AddNewIcon';
import { SaveIcon } from '@/ui/Icons/SaveIcon';
import { NotFound } from '@/ui/NotFound';
import { Row } from '@/ui/Row';
import { Select } from '@/ui/Select';
import { usePermissions } from '@/users/use-permissions';

import { useMemberById } from './useMemberById';

interface FormSchema {
  address: {
    cityName?: string;
    stateName?: string;
    street?: string;
    zipCode?: string;
  };
  birthDate?: dayjs.Dayjs | null;
  category: MemberCategory;
  documentID?: string;
  email: string;
  fileStatus: FileStatus;
  firstName: string;
  lastName: string;
  maritalStatus?: MaritalStatus;
  nationality?: MemberNationality;
  phones: string[];
  sex?: MemberSex;
  status: UserStatus;
}

export function MemberDetailPage() {
  const { message } = App.useApp();
  const permissions = usePermissions();

  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form] = Form.useForm<FormSchema>();
  const { setFieldsValue } = form;

  const memberQuery = useMemberById({ memberId: id });

  const createMemberMutation = useMutation<ParamId, Error, ICreateMemberDto>({
    mutationFn: (body) => $fetch('members', { body }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      navigate(`${APP_ROUTES.MEMBER_LIST}/${data.id}`, {
        replace: true,
      });
      message.success('Socio creado correctamente');
    },
  });

  const updateMemberMutation = useMutation<unknown, Error, IUpdateMemberDto>({
    mutationFn: (body) => $fetch(`members/${id}`, { body, method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['members', id] });
      message.success('Socio actualizado correctamente');
      navigate(-1);
    },
  });

  useEffect(() => {
    if (memberQuery.data) {
      setFieldsValue({
        address: {
          cityName: memberQuery.data.address?.cityName ?? '',
          stateName: memberQuery.data.address?.stateName ?? '',
          street: memberQuery.data.address?.street ?? '',
          zipCode: memberQuery.data.address?.zipCode ?? '',
        },
        birthDate: memberQuery.data.birthDate
          ? dayjs.utc(memberQuery.data.birthDate)
          : null,
        category: memberQuery.data.category,
        documentID: memberQuery.data.documentID ?? '',
        email: memberQuery.data.email,
        fileStatus: memberQuery.data.fileStatus,
        firstName: memberQuery.data.firstName,
        lastName: memberQuery.data.lastName,
        maritalStatus: memberQuery.data.maritalStatus ?? undefined,
        nationality: memberQuery.data.nationality ?? undefined,
        phones: memberQuery.data.phones,
        sex: memberQuery.data.sex ?? undefined,
        status: memberQuery.data.status,
      });
    }
  }, [memberQuery.data, setFieldsValue]);

  const onSubmit = async (values: FormSchema) => {
    if (id) {
      updateMemberMutation.mutate({
        address: {
          cityName: values.address.cityName || null,
          stateName: values.address.stateName || null,
          street: values.address.street || null,
          zipCode: values.address.zipCode || null,
        },
        birthDate: values.birthDate
          ? DateFormat.isoDate(values.birthDate)
          : null,
        category: values.category,
        documentID: values.documentID || null,
        email: values.email,
        fileStatus: values.fileStatus,
        firstName: values.firstName,
        lastName: values.lastName,
        maritalStatus: values.maritalStatus ?? null,
        nationality: values.nationality ?? null,
        phones: values.phones,
        sex: values.sex ?? null,
        status: values.status,
      });
    } else {
      createMemberMutation.mutate({
        address: {
          cityName: values.address.cityName || null,
          stateName: values.address.stateName || null,
          street: values.address.street || null,
          zipCode: values.address.zipCode || null,
        },
        birthDate: values.birthDate
          ? DateFormat.isoDate(values.birthDate)
          : null,
        category: values.category,
        documentID: values.documentID || null,
        email: values.email,
        fileStatus: values.fileStatus,
        firstName: values.firstName,
        lastName: values.lastName,
        maritalStatus: values.maritalStatus ?? null,
        nationality: values.nationality ?? null,
        phones: values.phones,
        sex: values.sex ?? null,
      });
    }
  };

  if (!permissions.members.create && !id) {
    return <NotFound />;
  }

  if (!permissions.members.update && id) {
    return <NotFound />;
  }

  const isQueryLoading = memberQuery.isLoading;
  const isMutating =
    createMemberMutation.isPending || updateMemberMutation.isPending;

  const canCreate = !id && permissions.members.create;
  const canUpdate = id && permissions.members.update;
  const canCreateOrUpdate = canCreate || canUpdate;

  return (
    <Card
      actions={[
        canCreateOrUpdate && (
          <Button
            disabled={isMutating}
            form="form"
            htmlType="submit"
            icon={<SaveIcon />}
            loading={isMutating}
            type="primary"
          >
            {id ? 'Actualizar socio' : 'Crear socio'}
          </Button>
        ),
      ].filter(Boolean)}
      backButton
      loading={isQueryLoading}
      title={memberQuery.data?.name ?? 'Nuevo socio'}
    >
      <Form<FormSchema>
        disabled={isMutating}
        form={form}
        id="form"
        initialValues={{
          address: {
            cityName: '',
            stateName: '',
            street: '',
            zipCode: '',
          },
          birthDate: undefined,
          category: MemberCategory.MEMBER,
          documentID: '',
          email: '',
          fileStatus: FileStatus.PENDING,
          firstName: '',
          lastName: '',
          maritalStatus: undefined,
          nationality: undefined,
          phones: [],
          sex: undefined,
        }}
        name="form"
        onFinish={onSubmit}
      >
        <Row>
          <Col md={12} xs={24}>
            <Space className="flex" size="middle" vertical>
              <Card size="small" title="Datos básicos" type="inner">
                <Form.Item<FormSchema>
                  label="Nombre"
                  name="firstName"
                  rules={[{ required: true, whitespace: true }]}
                >
                  <Input placeholder="Juan" />
                </Form.Item>

                <Form.Item<FormSchema>
                  label="Apellido"
                  name="lastName"
                  rules={[{ required: true, whitespace: true }]}
                >
                  <Input placeholder="Perez" />
                </Form.Item>

                <Form.Item<FormSchema>
                  label="Email"
                  name="email"
                  rules={[{ required: true, type: 'email', whitespace: true }]}
                >
                  <Input placeholder="juan.perez@example.com" type="email" />
                </Form.Item>

                <Form.Item<FormSchema>
                  label="Categoría"
                  name="category"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={Object.entries(MemberCategoryLabel).map(
                      ([key, value]) => ({
                        label: value,
                        value: key,
                      }),
                    )}
                  />
                </Form.Item>

                {id && (
                  <Form.Item<FormSchema>
                    label="Estado"
                    name="status"
                    rules={[{ required: true }]}
                  >
                    <Select
                      options={Object.entries(UserStatusLabel).map(
                        ([key, value]) => ({
                          label: value,
                          value: key,
                        }),
                      )}
                    />
                  </Form.Item>
                )}
              </Card>
              <Card size="small" title="Datos adicionales" type="inner">
                <Form.Item<FormSchema>
                  label="Fecha de nacimiento"
                  name="birthDate"
                  rules={[{ required: false }]}
                >
                  <DatePicker className="w-full" format="DD/MM/YYYY" />
                </Form.Item>

                <Form.Item<FormSchema>
                  label="Documento de identidad"
                  name="documentID"
                  rules={[{ required: false, whitespace: true }]}
                >
                  <Input placeholder="12.345.678" />
                </Form.Item>

                <Form.Item<FormSchema>
                  label="Ficha"
                  name="fileStatus"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={Object.entries(FileStatusLabel).map(
                      ([key, value]) => ({
                        label: value,
                        value: key,
                      }),
                    )}
                  />
                </Form.Item>

                <Form.Item<FormSchema>
                  label="Nacionalidad"
                  name="nationality"
                  rules={[{ required: false }]}
                >
                  <Select
                    options={Object.entries(MemberNationalityLabel).map(
                      ([key, value]) => ({
                        label: value,
                        value: key,
                      }),
                    )}
                  />
                </Form.Item>

                <Form.Item<FormSchema>
                  label="Sexo"
                  name="sex"
                  rules={[{ required: false }]}
                >
                  <Select
                    options={Object.entries(MemberSexLabel).map(
                      ([key, value]) => ({
                        label: value,
                        value: key,
                      }),
                    )}
                  />
                </Form.Item>

                <Form.Item<FormSchema>
                  label="Estado civil"
                  name="maritalStatus"
                  rules={[{ required: false }]}
                >
                  <Select
                    options={Object.entries(MaritalStatusLabel).map(
                      ([key, value]) => ({
                        label: value,
                        value: key,
                      }),
                    )}
                  />
                </Form.Item>

                {id && (
                  <Form.Item<FormSchema>
                    label="Estado"
                    name="status"
                    rules={[{ required: false }]}
                  >
                    <Select
                      options={Object.entries(UserStatusLabel).map(
                        ([key, value]) => ({
                          label: value,
                          value: key,
                        }),
                      )}
                    />
                  </Form.Item>
                )}
              </Card>
            </Space>
          </Col>

          <Col md={12} xs={24}>
            <Space className="flex" size="middle" vertical>
              <Form.List name="phones">
                {(fields, { add, remove }) => (
                  <Card
                    extra={
                      <Tooltip title="Agregar">
                        <Button
                          icon={<AddNewIcon />}
                          onClick={() => add()}
                          size="small"
                        />
                      </Tooltip>
                    }
                    size="small"
                    title="Datos de contacto"
                    type="inner"
                  >
                    {fields.map((field, index) => (
                      <Form.Item
                        key={field.key}
                        label={`Teléfono ${index + 1}`}
                        required
                      >
                        <Space.Compact block>
                          <Form.Item
                            {...field}
                            key={field.key}
                            label={`Teléfono ${index + 1}`}
                            noStyle
                            rules={[{ required: true }, { whitespace: true }]}
                          >
                            <Input placeholder="+54 9 11 1234-5678" />
                          </Form.Item>

                          <Button
                            icon={<DeleteOutlined />}
                            onClick={() => remove(field.name)}
                          />
                        </Space.Compact>
                      </Form.Item>
                    ))}

                    {fields.length === 0 && (
                      <Empty description="No hay teléfonos agregados" />
                    )}
                  </Card>
                )}
              </Form.List>

              <Card size="small" title="Domicilio" type="inner">
                <Form.Item<FormSchema>
                  label="Calle"
                  name={['address', 'street']}
                  rules={[{ required: false, whitespace: true }]}
                >
                  <Input placeholder="Dorrego 264" />
                </Form.Item>
                <Form.Item<FormSchema>
                  label="Ciudad"
                  name={['address', 'cityName']}
                  rules={[{ required: false, whitespace: true }]}
                >
                  <Input placeholder="Monte Grande" />
                </Form.Item>
                <Form.Item<FormSchema>
                  label="Estado"
                  name={['address', 'stateName']}
                  rules={[{ required: false, whitespace: true }]}
                >
                  <Input placeholder="Buenos Aires" />
                </Form.Item>
                <Form.Item<FormSchema>
                  label="Código postal"
                  name={['address', 'zipCode']}
                  rules={[{ required: false, whitespace: true }]}
                >
                  <Input placeholder="1842" />
                </Form.Item>
              </Card>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
