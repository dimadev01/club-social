import type { CreateMemberLedgerEntryDto } from '@club-social/shared/members';
import type { ParamIdDto } from '@club-social/shared/types';

import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import { MemberLedgerEntryMovementType } from '@club-social/shared/members';
import { App } from 'antd';
import dayjs from 'dayjs';
import { useNavigate, useSearchParams } from 'react-router';

import { appRoutes } from '@/app/app.enum';
import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { Card } from '@/ui/Card';
import { FormSubmitButton } from '@/ui/Form/FormSaveButton';
import { NotFound } from '@/ui/NotFound';
import { usePermissions } from '@/users/use-permissions';

import {
  MemberLedgerEntryForm,
  type MemberLedgerEntryFormData,
} from './MemberLedgerForm';

export function MemberLedgerNew() {
  const { message } = App.useApp();
  const permissions = usePermissions();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const memberIdFromUrl = searchParams.get('memberId') ?? undefined;

  const createMemberLedgerEntryMutation = useMutation<
    ParamIdDto,
    Error,
    CreateMemberLedgerEntryDto
  >({
    mutationFn: (body) => $fetch('/member-ledger', { body }),
    onSuccess: () => {
      message.success('Ajuste creado correctamente');
      navigate(appRoutes.memberLedger.list, { replace: true });
    },
  });

  const handleSubmit = (values: MemberLedgerEntryFormData) => {
    createMemberLedgerEntryMutation.mutate({
      amount: NumberFormat.toCents(values.amount),
      date: DateFormat.isoDate(values.date),
      memberId: values.memberId,
      movementType: values.movementType,
      notes: values.notes || null,
    });
  };

  if (!permissions.memberLedger.create) {
    return <NotFound />;
  }

  const isMutating = createMemberLedgerEntryMutation.isPending;

  return (
    <Card
      actions={[
        <FormSubmitButton disabled={isMutating} loading={isMutating}>
          Crear ajuste
        </FormSubmitButton>,
      ]}
      backButton
      title="Nuevo ajuste"
    >
      <MemberLedgerEntryForm
        disabled={isMutating}
        initialValues={{
          amount: 0,
          date: dayjs(),
          memberId: memberIdFromUrl,
          movementType: MemberLedgerEntryMovementType.INFLOW,
          notes: null,
        }}
        onSubmit={handleSubmit}
      />
    </Card>
  );
}
