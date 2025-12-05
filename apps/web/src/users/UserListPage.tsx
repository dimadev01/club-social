import type { PaginatedResponse } from '@club-social/types/shared';
import type { UserDto } from '@club-social/types/users';

import { betterFetch } from '@better-fetch/fetch';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Button as AntdButton, Card, Table } from 'antd';

export function UserListPage() {
  const usersQuery = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () =>
      betterFetch<PaginatedResponse<UserDto>>(
        'http://localhost:3000/users/paginated',
      ),
    queryKey: ['users'],
  });

  return (
    <Card>
      <Table columns={[]} dataSource={usersQuery.data?.data?.data} />
      {/* <Card.Section p="md" withBorder>
        <Group justify="space-between">
          <Title order={5}>Usuarios</Title>
          <Box>
            <Button
              component={NavLink}
              leftSection={<IconUsersPlus />}
              to={APP_ROUTES.USER_NEW}
            >
              Nuevo usuario
            </Button>
          </Box>
        </Group>
      </Card.Section> */}

      {/* <Card.Section p="md">
        <DataTable<UserDto>
          columns={[
            {
              accessor: 'id',
              render: (record) => (
                <Link to={`${APP_ROUTES.USER_LIST}/${record.id}`}>
                  {record.firstName} {record.lastName}
                </Link>
              ),
              title: 'Nombre',
            },
            {
              accessor: 'email',
              render: (record) => (
                <>
                  <MantineText>{record.email}</MantineText>
                  <Text component="span">{record.email}</Text>
                </>
                // <CopyButton value={record.email}>
                //   {({ copied, copy }) => (
                //     <Text>
                //       {record.email}

                //       <Tooltip label={copied ? 'Copiado' : 'Copiar'}>
                //         <ActionIcon
                //           color={copied ? 'green' : 'gray'}
                //           onClick={copy}
                //           variant="transparent"
                //         >
                //           {copied ? (
                //             <IconCheck size={16} />
                //           ) : (
                //             <IconCopy size={16} />
                //           )}
                //         </ActionIcon>
                //       </Tooltip>
                //     </Text>
                //   )}
                // </CopyButton>
              ),
              title: 'Email',
            },
          ]}
          highlightOnHover
          onPageChange={() => {
            console.log('page changed');
          }}
          page={1}
          records={usersQuery.data?.data?.data}
          recordsPerPage={10}
          totalRecords={usersQuery.data?.data?.total}
          withColumnBorders
          withTableBorder
        />
      </Card.Section> */}

      <AntdButton className="bg-black" type="primary">
        Click me
      </AntdButton>
    </Card>
  );
}
