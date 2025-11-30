import { Box, Button, Card, Group, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconUsersPlus } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from 'mantine-datatable';
import { NavLink } from 'react-router';

import { APP_ROUTES } from '@/app/app.enum';

export function UserListPage() {
  const {
    data: users,
    error,
    isLoading,
  } = useQuery({
    queryFn: () =>
      fetch('http://localhost:3000/users/paginated').then((res) => res.json()),
    queryKey: ['users'],
  });

  console.log(users, error, isLoading);

  return (
    <>
      <Card withBorder>
        <Card.Section p="md" withBorder>
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
        </Card.Section>

        <Card.Section p="md">
          <DataTable
            // 👇 define columns
            columns={[
              {
                accessor: 'id',
                // 👇 right-align column
                textAlign: 'right',
                // 👇 this column has a custom title
                title: '#',
              },
              { accessor: 'name' },
              {
                accessor: 'party',
                // 👇 this column has custom cell data rendering
                render: ({ party }) => (
                  <Box c={party === 'Democratic' ? 'blue' : 'red'} fw={700}>
                    {party.slice(0, 3).toUpperCase()}
                  </Box>
                ),
              },
              { accessor: 'bornIn' },
            ]}
            highlightOnHover
            // 👇 execute this callback when a row is clicked
            onRowClick={({ record: { bornIn, name, party } }) =>
              showNotification({
                message: `You clicked on ${name}, a ${party.toLowerCase()} president born in ${bornIn}`,
                title: `Clicked on ${name}`,
                withBorder: true,
              })
            }
            // 👇 provide data
            records={[
              { bornIn: 1942, id: 1, name: 'Joe Biden', party: 'Democratic' },
              // more records...
            ]}
            striped
            withColumnBorders
            withTableBorder
          />
        </Card.Section>
      </Card>
    </>
  );
}
