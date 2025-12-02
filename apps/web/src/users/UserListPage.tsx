import type { PaginatedResponse } from '@club-social/types/shared';
import type { UserDto } from '@club-social/types/users';

import { betterFetch } from '@better-fetch/fetch';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Group,
  Portal,
  Text,
  Title,
} from '@mantine/core';
import { IconUsersPlus } from '@tabler/icons-react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { DataTable } from 'mantine-datatable';
import { NavLink } from 'react-router';

import { APP_ROUTES } from '@/app/app.enum';

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
    <>
      <Portal target="#breadcrumbs">
        <Breadcrumbs>
          <NavLink to={APP_ROUTES.HOME}>
            <Text size="sm">Inicio</Text>
          </NavLink>
          <NavLink to={APP_ROUTES.USER_LIST}>
            <Text size="sm">Usuarios</Text>
          </NavLink>
          <NavLink to={APP_ROUTES.USER_NEW}>
            <Text size="sm">Nuevo Usuario</Text>
          </NavLink>
        </Breadcrumbs>
      </Portal>

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
          <DataTable<UserDto>
            columns={[
              {
                accessor: 'id',
                title: 'ID',
              },
              {
                accessor: 'firstName',
                title: 'Nombre',
              },
              {
                accessor: 'lastName',
                title: 'Apellido',
              },
            ]}
            highlightOnHover
            maxHeight={500}
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
        </Card.Section>
      </Card>
    </>
  );
}
