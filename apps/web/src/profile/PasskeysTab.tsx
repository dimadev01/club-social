import { DeleteOutlined } from '@ant-design/icons';
import { DateFormat } from '@club-social/shared/lib';
import { App, Empty, Space } from 'antd';

import { useMutation } from '@/shared/hooks/useMutation';
import { useQuery } from '@/shared/hooks/useQuery';
import { betterAuthClient } from '@/shared/lib/better-auth.client';
import { queryKeys } from '@/shared/lib/query-keys';
import { Button, Card, Descriptions } from '@/ui';

export function PasskeysTab() {
  const { message } = App.useApp();

  const { data: passkeys, refetch: refetchPasskeys } = useQuery({
    ...queryKeys.passkeys.list,
    queryFn: () => betterAuthClient.passkey.listUserPasskeys(),
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

  return (
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
  );
}
