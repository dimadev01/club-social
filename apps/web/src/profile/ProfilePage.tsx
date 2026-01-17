import type { MemberDto } from '@club-social/shared/members';

import { DeleteOutlined, MailOutlined } from '@ant-design/icons';
import { DateFormat } from '@club-social/shared/lib';
import {
  Theme,
  ThemeAlgorithm,
  ThemeAlgorithmLabel,
  ThemeLabel,
  UserRole,
} from '@club-social/shared/users';
import { useQueryClient } from '@tanstack/react-query';
import { App, Empty, Radio, Space, Switch, Tabs } from 'antd';
import { useLocation, useNavigate } from 'react-router';

import { useAppContext } from '@/app/AppContext';
import { useSessionUser } from '@/auth/useUser';
import { useMyMember } from '@/members/useMyMember';
import { useUpdateMyNotificationPreferences } from '@/members/useUpdateMyNotificationPreferences';
import { useMutation } from '@/shared/hooks/useMutation';
import { useQuery } from '@/shared/hooks/useQuery';
import { betterAuthClient } from '@/shared/lib/better-auth.client';
import { queryKeys } from '@/shared/lib/query-keys';
import { labelMapToSelectOptions } from '@/shared/lib/utils';
import { Button, Card, Descriptions, Form, Input, Page } from '@/ui';
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
  const location = useLocation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const user = useSessionUser();
  const isMember = user.role === UserRole.MEMBER;

  const { preferences } = useAppContext();

  const [profileForm] = Form.useForm<ProfileFormSchema>();
  const [emailForm] = Form.useForm<EmailFormSchema>();

  const activeTab = location.hash.slice(1) || 'profile';

  const handleTabChange = (key: string) => {
    navigate(`#${key}`, { replace: true });
  };

  const { data: passkeys, refetch: refetchPasskeys } = useQuery({
    ...queryKeys.passkeys.list,
    queryFn: () => betterAuthClient.passkey.listUserPasskeys(),
  });

  const { data: member, isLoading: isLoadingMember } = useMyMember();
  const updateNotificationPreferences = useUpdateMyNotificationPreferences();

  const updatePreferences = useUpdateMyPreferences();

  const submitProfileMutation = useMutation({
    mutationFn: (values: ProfileFormSchema) =>
      betterAuthClient.updateUser({
        firstName: values.firstName,
        lastName: values.lastName,
        name: `${values.firstName} ${values.lastName}`,
        updatedAt: new Date(),
        updatedBy: user.name,
      }),
    onSuccess: ({ error }) => {
      if (error) {
        message.error('Error al actualizar perfil');

        return;
      }

      message.success('Perfil actualizado');
    },
  });

  const submitEmailMutation = useMutation({
    mutationFn: (values: EmailFormSchema) =>
      betterAuthClient.changeEmail({
        callbackURL: window.location.origin,
        newEmail: values.email,
      }),
    onSuccess: ({ error }) => {
      if (error) {
        message.error('Error al cambiar email');

        return;
      }

      message.success('Link de verificación enviado');
    },
  });

  const addPasskeyMutation = useMutation({
    mutationFn: () =>
      betterAuthClient.passkey.addPasskey({
        authenticatorAttachment: 'platform',
      }),
    onSuccess: ({ error }) => {
      if (error) {
        message.error('Error al agregar passkey');

        return;
      }

      message.success('Passkey agregada');
      refetchPasskeys();
    },
  });

  const deletePasskeyMutation = useMutation({
    mutationFn: (id: string) => betterAuthClient.passkey.deletePasskey({ id }),
    onSuccess: ({ error }) => {
      if (error) {
        message.error('Error al eliminar passkey');

        return;
      }

      message.success('Passkey eliminada');
      refetchPasskeys();
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
      <Tabs
        activeKey={activeTab}
        items={[
          {
            children: (
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
            ),
            key: 'profile',
            label: 'Mis datos',
          },
          {
            children: (
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
                    rules={[
                      { required: true, type: 'email', whitespace: true },
                    ]}
                  >
                    <Input
                      className="sm:w-60"
                      placeholder="juan.perez@example.com"
                      type="email"
                    />
                  </Form.Item>
                </Form>
              </Card>
            ),
            key: 'access',
            label: 'Acceso',
          },
          {
            children: (
              <Card
                actions={[
                  <Button
                    onClick={() => addPasskeyMutation.mutate()}
                    type="primary"
                  >
                    Agregar passkey
                  </Button>,
                ]}
                title="Passkeys"
              >
                {passkeys?.data && passkeys.data.length === 0 && (
                  <Empty description="No hay passkeys agregadas" />
                )}

                {passkeys?.data?.map((passkey) => (
                  <Card.Grid
                    className="w-full md:w-1/2 lg:w-1/3"
                    key={passkey.id}
                  >
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
            ),
            key: 'passkeys',
            label: 'Passkeys',
          },
          {
            children: (
              <Card title="Interfaz">
                <Descriptions>
                  <Descriptions.Item label="Tema">
                    <Radio.Group
                      className="w-full"
                      key={preferences.theme}
                      onChange={(value) =>
                        updatePreferences.mutate({
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
                        updatePreferences.mutate({
                          themeAlgorithm: value.target.value as ThemeAlgorithm,
                        })
                      }
                      options={labelMapToSelectOptions(ThemeAlgorithmLabel)}
                      value={preferences.themeAlgorithm}
                    />
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            ),
            key: 'interface',
            label: 'Interfaz',
          },
          ...(isMember
            ? [
                {
                  children: (
                    <Card
                      loading={isLoadingMember}
                      title="Preferencias de notificación"
                    >
                      <Descriptions styles={{ label: { width: 250 } }}>
                        <Descriptions.Item label="Notificar nueva cuota">
                          <Switch
                            checked={
                              member?.notificationPreferences.notifyOnDueCreated
                            }
                            onChange={(checked) => {
                              queryClient.setQueryData(
                                queryKeys.members.me.queryKey,
                                (old: MemberDto) => ({
                                  ...old,
                                  notificationPreferences: {
                                    ...old.notificationPreferences,
                                    notifyOnDueCreated: checked,
                                  },
                                }),
                              );

                              updateNotificationPreferences.mutate({
                                notifyOnDueCreated: checked,
                              });
                            }}
                          />
                        </Descriptions.Item>
                        <Descriptions.Item label="Notificar pago realizado">
                          <Switch
                            checked={
                              member?.notificationPreferences
                                .notifyOnPaymentMade
                            }
                            onChange={(checked) => {
                              queryClient.setQueryData(
                                queryKeys.members.me.queryKey,
                                (old: MemberDto) => ({
                                  ...old,
                                  notificationPreferences: {
                                    ...old.notificationPreferences,
                                    notifyOnPaymentMade: checked,
                                  },
                                }),
                              );

                              updateNotificationPreferences.mutate({
                                notifyOnPaymentMade: checked,
                              });
                            }}
                          />
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  ),
                  key: 'notifications',
                  label: 'Notificaciones',
                },
              ]
            : []),
        ]}
        onChange={handleTabChange}
      />
    </Page>
  );
}
