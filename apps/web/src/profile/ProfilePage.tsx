import { DeleteOutlined, MailOutlined } from '@ant-design/icons';
import { DateFormat } from '@club-social/shared/lib';
import {
  Theme,
  ThemeAlgorithm,
  ThemeAlgorithmLabel,
  ThemeLabel,
  ThemeVariant,
  ThemeVariantLabel,
  type UpdateUserPreferencesDto,
  type UserPreferencesDto,
} from '@club-social/shared/users';
import { useQueryClient } from '@tanstack/react-query';
import { App, Empty, Input, Radio, Space } from 'antd';

import { useAppContext } from '@/app/AppContext';
import { useSessionUser } from '@/auth/useUser';
import { useMutation } from '@/shared/hooks/useMutation';
import { useQuery } from '@/shared/hooks/useQuery';
import { betterAuthClient } from '@/shared/lib/better-auth.client';
import { queryKeys } from '@/shared/lib/query-keys';
import { labelMapToSelectOptions } from '@/shared/lib/utils';
import { Button, Card, Descriptions, Form, Page, Select } from '@/ui';
import { useUpdateMyPreferences } from '@/users/useUpdateMyPreferences';

interface EmailFormSchema {
  email: string;
}

interface ProfileFormSchema {
  firstName: string;
  lastName: string;
}

export function ProfilePage() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  const user = useSessionUser();

  const { preferences } = useAppContext();

  const [profileForm] = Form.useForm<ProfileFormSchema>();
  const [emailForm] = Form.useForm<EmailFormSchema>();

  const { data: passkeys, refetch: refetchPasskeys } = useQuery({
    ...queryKeys.passkeys.list,
    queryFn: () => betterAuthClient.passkey.listUserPasskeys(),
  });

  const updatePreferences = useUpdateMyPreferences();

  const handleUpdatePreferences = (values: UpdateUserPreferencesDto) => {
    updatePreferences.mutate(values, {
      onSuccess: () => {
        queryClient.setQueryData(
          queryKeys.users.me.queryKey,
          (old: UserPreferencesDto) => {
            return {
              ...old,
              ...values,
            };
          },
        );
      },
    });
  };

  const submitProfileMutation = useMutation({
    mutationFn: (values: ProfileFormSchema) =>
      betterAuthClient.updateUser({
        firstName: values.firstName,
        lastName: values.lastName,
        name: `${values.firstName} ${values.lastName}`,
        updatedAt: new Date(),
        updatedBy: user.name,
      }),
    onSuccess: ({ data, error }) => {
      if (data) {
        message.success('Perfil actualizado');
      }

      if (error) {
        message.error('Error al actualizar perfil');
      }
    },
  });

  const submitEmailMutation = useMutation({
    mutationFn: (values: EmailFormSchema) =>
      betterAuthClient.changeEmail({
        callbackURL: window.location.origin,
        newEmail: values.email,
      }),
    onSuccess: ({ data, error }) => {
      if (data) {
        message.success('Link de verificación enviado');
      }

      if (error) {
        message.error('Error al cambiar email');
      }
    },
  });

  const addPasskeyMutation = useMutation({
    mutationFn: () =>
      betterAuthClient.passkey.addPasskey({
        authenticatorAttachment: 'platform',
      }),
    onSuccess: ({ data, error }) => {
      if (data) {
        message.success('Passkey agregada');
        refetchPasskeys();
      }

      if (error) {
        message.error('Error al agregar passkey');
      }
    },
  });

  const deletePasskeyMutation = useMutation({
    mutationFn: (id: string) => betterAuthClient.passkey.deletePasskey({ id }),
    onSuccess: ({ data, error }) => {
      if (data) {
        message.success('Passkey eliminada');
        refetchPasskeys();
      }

      if (error) {
        message.error('Error al eliminar passkey');
      }
    },
  });

  const onSubmitProfile = (values: ProfileFormSchema) => {
    submitProfileMutation.mutate(values);
  };

  const onSubmitEmail = (values: EmailFormSchema) => {
    if (user.email === values.email) {
      message.info('El email ingresado es el mismo que el actual');

      return;
    }

    submitEmailMutation.mutate(values);
  };

  return (
    <Page>
      <Space className="flex" vertical>
        <Card
          actions={[
            <Button
              disabled={submitProfileMutation.isPending}
              form="profileForm"
              htmlType="submit"
              loading={submitProfileMutation.isPending}
              type="primary"
            >
              Actualizar perfil
            </Button>,
          ]}
          title="Mis datos"
        >
          <Form<ProfileFormSchema>
            autoComplete="off"
            disabled={submitProfileMutation.isPending}
            form={profileForm}
            id="profileForm"
            initialValues={{
              firstName: user.firstName,
              lastName: user.lastName,
            }}
            layout="vertical"
            name="profileForm"
            onFinish={onSubmitProfile}
            scrollToFirstError
          >
            <Form.Item<ProfileFormSchema>
              label="Nombre"
              name="firstName"
              rules={[{ required: true, whitespace: true }]}
            >
              <Input placeholder="Juan" />
            </Form.Item>
            <Form.Item<ProfileFormSchema>
              label="Apellido"
              name="lastName"
              rules={[{ required: true, whitespace: true }]}
            >
              <Input placeholder="Perez" />
            </Form.Item>
          </Form>
        </Card>

        <Card
          actions={[
            <Button
              disabled={submitEmailMutation.isPending}
              form="emailForm"
              htmlType="submit"
              icon={<MailOutlined />}
              loading={submitEmailMutation.isPending}
              type="primary"
            >
              Cambiar email
            </Button>,
          ]}
          title="Inicio de sesión"
        >
          <Form<EmailFormSchema>
            autoComplete="off"
            disabled={submitEmailMutation.isPending}
            form={emailForm}
            id="emailForm"
            initialValues={{
              email: user.email,
            }}
            layout="vertical"
            name="emailForm"
            onFinish={onSubmitEmail}
            scrollToFirstError
          >
            <Form.Item<EmailFormSchema>
              label="Email"
              name="email"
              rules={[{ required: true, type: 'email', whitespace: true }]}
            >
              <Input placeholder="juan.perez@example.com" type="email" />
            </Form.Item>
          </Form>
        </Card>

        <Card
          actions={[
            <Button onClick={() => addPasskeyMutation.mutate()} type="primary">
              Agregar passkey
            </Button>,
          ]}
          title="Passkeys"
        >
          {passkeys?.data && passkeys.data.length === 0 && (
            <Empty description="No hay passkeys agregadas" />
          )}

          {passkeys?.data?.map((passkey) => (
            <Card.Grid className="w-full md:w-1/2 lg:w-1/3" key={passkey.id}>
              <Space align="center">
                <Descriptions
                  bordered={false}
                  items={[
                    {
                      children: DateFormat.dateTime(passkey.createdAt),
                      label: 'Creada el',
                    },
                  ]}
                />
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => deletePasskeyMutation.mutate(passkey.id)}
                  size="small"
                  type="primary"
                />
              </Space>
            </Card.Grid>
          ))}
        </Card>

        <Card title="Interfaz">
          <Descriptions>
            <Descriptions.Item label="Tema">
              <Radio.Group
                className="w-full"
                key={preferences.theme}
                onChange={(value) =>
                  handleUpdatePreferences({
                    theme: value.target.value as Theme,
                  })
                }
                options={labelMapToSelectOptions(ThemeLabel)}
                value={preferences.theme}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Modo compacto">
              <Radio.Group
                className="w-full"
                key={preferences.themeAlgorithm}
                onChange={(value) =>
                  handleUpdatePreferences({
                    themeAlgorithm: value.target.value as ThemeAlgorithm,
                  })
                }
                options={labelMapToSelectOptions(ThemeAlgorithmLabel)}
                value={preferences.themeAlgorithm}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Variante">
              <Select
                className="w-full"
                key={preferences.theme}
                onChange={(value) =>
                  handleUpdatePreferences({
                    themeVariant: value as ThemeVariant,
                  })
                }
                options={labelMapToSelectOptions(ThemeVariantLabel)}
                value={preferences.themeVariant}
              />
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>
    </Page>
  );
}
