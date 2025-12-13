import type { IdDto } from '@club-social/shared/shared';

import {
  CloseOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  SaveOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  type CreateMemberDto,
  FileStatus,
  FileStatusLabel,
  MaritalStatus,
  MaritalStatusLabel,
  MemberCategory,
  MemberCategoryLabel,
  type MemberDto,
  MemberNationality,
  MemberNationalityLabel,
  MemberSex,
  MemberSexLabel,
  type UpdateMemberDto,
} from '@club-social/shared/members';
import { UserStatus, UserStatusLabel } from '@club-social/shared/users';
import { useQueryClient } from '@tanstack/react-query';
import {
  App,
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Form,
  Input,
  Skeleton,
  Space,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { APP_ROUTES } from '@/app/app.enum';
import { NotFound } from '@/components/NotFound';
import { Page, PageContent } from '@/components/Page';
import { Row } from '@/components/Row';
import { Select } from '@/components/Select';
import { $fetch } from '@/shared/lib/fetch';
import { useMutation } from '@/shared/lib/useMutation';
import { useQuery } from '@/shared/lib/useQuery';
import { usePermissions } from '@/users/use-permissions';

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

  const memberQuery = useQuery<MemberDto | null>({
    enabled: !!id && permissions.members.get,
    queryFn: () => $fetch(`members/${id}`),
    queryKey: ['members', id],
  });

  const createMemberMutation = useMutation<IdDto, Error, CreateMemberDto>({
    mutationFn: (body) => $fetch('members', { body }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      navigate(`${APP_ROUTES.MEMBER_LIST}/${data.id}`, {
        replace: true,
      });
      message.success('Socio creado correctamente');
    },
  });

  const updateMemberMutation = useMutation<unknown, Error, UpdateMemberDto>({
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
          ? dayjs(memberQuery.data.birthDate)
          : null,
        category: memberQuery.data.category,
        documentID: memberQuery.data.documentID ?? '',
        email: memberQuery.data.email,
        fileStatus: memberQuery.data.fileStatus,
        firstName: memberQuery.data.firstName,
        lastName: memberQuery.data.lastName,
        nationality: memberQuery.data.nationality ?? undefined,
        phones: memberQuery.data.phones ?? [],
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
        birthDate: values.birthDate ? values.birthDate.toISOString() : null,
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
        birthDate: values.birthDate ? values.birthDate.toISOString() : null,
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

  const isLoading =
    memberQuery.isLoading ||
    createMemberMutation.isPending ||
    updateMemberMutation.isPending;

  if (!permissions.members.create && !id) return <NotFound />;
  if (!permissions.members.update && id) return <NotFound />; // Or read-only view? Assuming edit rights for now.

  return (
    <Page>
      <PageContent>
        <Card
          actions={[
            <Button
              disabled={isLoading}
              icon={<CloseOutlined />}
              onClick={() => navigate(-1)}
              type="link"
            >
              Cancelar
            </Button>,
            <Button
              disabled={isLoading}
              form="form"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={
                createMemberMutation.isPending || updateMemberMutation.isPending
              }
              type="primary"
            >
              {id ? 'Actualizar socio' : 'Crear socio'}
            </Button>,
          ]}
          loading={memberQuery.isLoading}
          title={
            <Space>
              <UserOutlined />
              {memberQuery.isLoading && <Skeleton.Input active />}
              {!memberQuery.isLoading && (
                <>
                  {id
                    ? `${memberQuery.data?.firstName} ${memberQuery.data?.lastName}`
                    : 'Nuevo socio'}
                </>
              )}
            </Space>
          }
        >
          <Form<FormSchema>
            autoComplete="off"
            disabled={isLoading}
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
              nationality: undefined,
              phones: undefined,
              sex: undefined,
            }}
            layout="vertical"
            name="form"
            onFinish={onSubmit}
            scrollToFirstError
          >
            <Row>
              <Col md={12} xs={24}>
                <Space className="flex" size="middle" vertical>
                  <Card title="Datos básicos" type="inner">
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
                      rules={[
                        { required: true, type: 'email', whitespace: true },
                      ]}
                    >
                      <Input
                        placeholder="juan.perez@example.com"
                        type="email"
                      />
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
                  <Card title="Datos adicionales" type="inner">
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
                      <Input placeholder="1234567890" />
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
                    {(fields, { add, remove }, { errors }) => (
                      <Card
                        extra={
                          <Button
                            icon={<PlusCircleOutlined />}
                            onClick={() => add()}
                          />
                        }
                        title="Datos de contacto"
                        type="inner"
                      >
                        {fields.map((field, index) => (
                          <Form.Item
                            key={field.key}
                            label={`Teléfono ${index + 1}`}
                            required
                          >
                            <Form.Item
                              {...field}
                              key={field.key}
                              label={`Teléfono ${index + 1}`}
                              noStyle
                              rules={[{ required: true }, { whitespace: true }]}
                            >
                              <Space.Compact block>
                                <Input placeholder="+54 9 11 1234-5678" />
                                <Button
                                  icon={<DeleteOutlined />}
                                  onClick={() => remove(field.name)}
                                />
                              </Space.Compact>
                            </Form.Item>
                            <Form.ErrorList
                              className="text-red-500"
                              errors={errors}
                            />
                          </Form.Item>
                        ))}

                        {fields.length === 0 && (
                          <Empty description="No hay teléfonos agregados" />
                        )}
                      </Card>
                    )}
                  </Form.List>

                  <Card title="Domicilio" type="inner">
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
      </PageContent>
    </Page>
  );
}
