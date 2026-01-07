import type { CreateMemberLedgerEntryDto } from '@club-social/shared/members';
import type { ParamIdDto } from '@club-social/shared/types';

import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import { MemberLedgerEntryMovementType } from '@club-social/shared/members';
import { App, type FormInstance } from 'antd';
import dayjs from 'dayjs';
import { useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { useMutation } from '@/shared/hooks/useMutation';
import { $fetch } from '@/shared/lib/fetch';
import { Card, FormSubmitButton, NotFound } from '@/ui';
import { FormSubmitButtonAndBack } from '@/ui/Form/FormSubmitAndBack';
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
  const shouldNavigateBack = useRef(false);

  const memberIdFromUrl = searchParams.get('memberId') ?? undefined;

  const createMemberLedgerEntryMutation = useMutation<
    ParamIdDto,
    Error,
    CreateMemberLedgerEntryDto
  >({
    mutationFn: (body) => $fetch('/member-ledger', { body }),
  });

  const handleSubmit = (
    values: MemberLedgerEntryFormData,
    form: FormInstance<MemberLedgerEntryFormData>,
  ) => {
    createMemberLedgerEntryMutation.mutate(
      {
        amount: NumberFormat.toCents(values.amount),
        date: DateFormat.isoDate(values.date),
        memberId: values.memberId,
        movementType: values.movementType,
        notes: values.notes || null,
      },
      {
        onSuccess: () => {
          message.success('Ajuste creado correctamente');

          if (shouldNavigateBack.current) {
            navigate(-1);
          } else {
            form.resetFields(['amount', 'memberId', 'notes']);
          }
        },
      },
    );
  };

  if (!permissions.memberLedger.create) {
    return <NotFound />;
  }

  const isMutating = createMemberLedgerEntryMutation.isPending;

  return (
    <Card
      actions={[
        <FormSubmitButtonAndBack
          disabled={isMutating}
          loading={isMutating}
          onClick={() => (shouldNavigateBack.current = true)}
        />,
        <FormSubmitButton
          disabled={isMutating}
          loading={isMutating}
          onClick={() => (shouldNavigateBack.current = false)}
        >
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
