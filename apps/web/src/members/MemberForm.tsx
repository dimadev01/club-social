import type dayjs from 'dayjs';

import { DeleteOutlined } from '@ant-design/icons';
import {
  FileStatus,
  FileStatusLabel,
  MaritalStatus,
  MaritalStatusLabel,
  MemberCategory,
  MemberCategoryLabel,
  MemberNationality,
  MemberNationalityLabel,
  MemberSex,
  MemberSexLabel,
  MemberStatus,
  MemberStatusLabel,
} from '@club-social/shared/members';
import { Col, DatePicker, Empty, Input, Radio, Space } from 'antd';

import { labelMapToSelectOptions } from '@/shared/lib/utils';
import { AddNewIcon, Button, Card, Form, Row, Select } from '@/ui';

export interface MemberFormData {
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
  status: MemberStatus;
}

export type MemberFormInitialValues = Partial<MemberFormData>;

interface MemberFormProps {
  disabled?: boolean;
  initialValues?: MemberFormInitialValues;
  mode: 'create' | 'edit';
  onSubmit: (data: MemberFormData) => void;
}

export function MemberForm({
  disabled = false,
  initialValues,
  mode,
  onSubmit,
}: MemberFormProps) {
  const [form] = Form.useForm<MemberFormData>();

  const isEditMode = mode === 'edit';

  return (
    <Form<MemberFormData>
      disabled={disabled}
      form={form}
      id="form"
      initialValues={initialValues}
      name="form"
      onFinish={onSubmit}
    >
      <Row>
        <Col md={12} xs={24}>
          <Space className="flex" vertical>
            <Card size="small" title="Datos básicos" type="inner">
              <Form.Item<MemberFormData>
                label="Nombre"
                name="firstName"
                rules={[{ required: true, whitespace: true }]}
              >
                <Input placeholder="Juan" />
              </Form.Item>

              <Form.Item<MemberFormData>
                label="Apellido"
                name="lastName"
                rules={[{ required: true, whitespace: true }]}
              >
                <Input placeholder="Perez" />
              </Form.Item>

              <Form.Item<MemberFormData>
                label="Email"
                name="email"
                rules={[{ required: true, type: 'email', whitespace: true }]}
              >
                <Input placeholder="juan.perez@example.com" type="email" />
              </Form.Item>

              <Form.Item<MemberFormData>
                label="Categoría"
                name="category"
                rules={[{ required: true }]}
              >
                <Select
                  options={labelMapToSelectOptions(MemberCategoryLabel)}
                />
              </Form.Item>

              {isEditMode && (
                <Form.Item<MemberFormData>
                  label="Estado"
                  name="status"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={labelMapToSelectOptions(MemberStatusLabel)}
                  />
                </Form.Item>
              )}
            </Card>
            <Card size="small" title="Datos adicionales" type="inner">
              <Form.Item<MemberFormData>
                label="Fecha de nacimiento"
                name="birthDate"
                rules={[{ required: false }]}
              >
                <DatePicker className="w-full" format="DD/MM/YYYY" />
              </Form.Item>

              <Form.Item<MemberFormData>
                label="Documento de identidad"
                name="documentID"
                rules={[{ required: false, whitespace: true }]}
              >
                <Input placeholder="12.345.678" />
              </Form.Item>

              <Form.Item<MemberFormData>
                label="Ficha"
                name="fileStatus"
                rules={[{ required: true }]}
              >
                <Radio.Group
                  options={labelMapToSelectOptions(FileStatusLabel)}
                />
              </Form.Item>

              <Form.Item<MemberFormData>
                label="Nacionalidad"
                name="nationality"
                rules={[{ required: false }]}
              >
                <Select
                  options={labelMapToSelectOptions(MemberNationalityLabel)}
                />
              </Form.Item>

              <Form.Item<MemberFormData>
                label="Sexo"
                name="sex"
                rules={[{ required: false }]}
              >
                <Radio.Group
                  options={labelMapToSelectOptions(MemberSexLabel)}
                />
              </Form.Item>

              <Form.Item<MemberFormData>
                label="Estado civil"
                name="maritalStatus"
                rules={[{ required: false }]}
              >
                <Select options={labelMapToSelectOptions(MaritalStatusLabel)} />
              </Form.Item>
            </Card>
          </Space>
        </Col>

        <Col md={12} xs={24}>
          <Space className="flex" vertical>
            <Form.List name="phones">
              {(fields, { add, remove }) => (
                <Card
                  extra={
                    <Button
                      icon={<AddNewIcon />}
                      onClick={() => add()}
                      size="small"
                      tooltip="Agregar"
                    />
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
              <Form.Item<MemberFormData>
                label="Calle"
                name={['address', 'street']}
                rules={[{ required: false, whitespace: true }]}
              >
                <Input placeholder="Dorrego 264" />
              </Form.Item>
              <Form.Item<MemberFormData>
                label="Ciudad"
                name={['address', 'cityName']}
                rules={[{ required: false, whitespace: true }]}
              >
                <Input placeholder="Monte Grande" />
              </Form.Item>
              <Form.Item<MemberFormData>
                label="Estado"
                name={['address', 'stateName']}
                rules={[{ required: false, whitespace: true }]}
              >
                <Input placeholder="Buenos Aires" />
              </Form.Item>
              <Form.Item<MemberFormData>
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
  );
}
