import type { PreviewBulkDuesResultDto } from '@club-social/shared/dues';
import type { MemberCategory } from '@club-social/shared/members';

import { useQuery } from '@/shared/hooks/useQuery';
import { $fetch } from '@/shared/lib/fetch';
import { usePermissions } from '@/users/use-permissions';

interface PreviewBulkDuesParams {
  memberCategory?: MemberCategory;
}

export function usePreviewBulkDues({ memberCategory }: PreviewBulkDuesParams) {
  const permissions = usePermissions();

  return useQuery({
    enabled: !!memberCategory && permissions.dues.create,
    queryFn: () =>
      $fetch<PreviewBulkDuesResultDto>('dues/preview-bulk', {
        body: { memberCategory },
        method: 'POST',
      }),
    queryKey: ['dues', 'preview-bulk', memberCategory],
  });
}
