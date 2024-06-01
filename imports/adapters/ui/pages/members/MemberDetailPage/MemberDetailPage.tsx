import { Breadcrumb, Skeleton } from 'antd';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { AppUrl } from '@adapters/ui/app.enum';
import { NotFound } from '@adapters/ui/components/NotFound';
import { useMember } from '@adapters/ui/hooks/members/useMember';
import { MemberDetailInfo } from '@adapters/ui/pages/members/MemberDetailPage/MemberDetailInfo';

export const MembersDetailPage = () => {
  const { id } = useParams<{ id?: string }>();

  const { data: member, fetchStatus: memberFetchStatus } = useMember(
    id ? { id } : undefined,
  );

  const isLoading = memberFetchStatus === 'fetching';

  if (!isLoading && id && !member) {
    return <NotFound />;
  }

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[
          { title: 'Inicio' },
          { title: <Link to={AppUrl.Members}>Socios</Link> },
          {
            title: member
              ? `${member.firstName} ${member.lastName}`
              : 'Nuevo Socio',
          },
        ]}
      />

      <Skeleton active loading={isLoading}>
        <MemberDetailInfo member={member} />
      </Skeleton>
    </>
  );
};
