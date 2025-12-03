import { Alert, Button, Stack, Text } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useNavigate } from 'react-router';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <Stack>
      <Alert color="red" icon={<IconAlertCircle />}>
        <Text>Usuario no encontrado</Text>
      </Alert>
      <Button
        className="self-start"
        onClick={() => navigate(-1)}
        variant="outline"
      >
        Volver
      </Button>
    </Stack>
  );
}
