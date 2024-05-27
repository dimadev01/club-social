import { Breadcrumb, Skeleton, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';

import { AppUrl } from '@ui/app.enum';
import { NotFound } from '@ui/components/NotFound';
import { useMemberNew } from '@ui/hooks/members/useMemberNew';

export const MembersDetailPage = () => {
  const { id } = useParams<{ id?: string }>();

  const navigate = useNavigate();

  const location = useLocation();

  const { data: member, fetchStatus: memberFetchStatus } = useMemberNew(
    id ? { id } : undefined,
  );

  const [tabKey, setTabKey] = useState<string>();

  useEffect(() => {
    if (!tabKey) {
      if (location.hash) {
        setTabKey(location.hash.replace('#', ''));
      } else {
        navigate('#info', { replace: true });
      }
    }
  }, [location.hash, navigate, tabKey]);

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
          { title: <NavLink to={AppUrl.Members}>Socios</NavLink> },
          {
            title: member ? `${member.id}}` : 'Nuevo Socio',
          },
        ]}
      />

      <Skeleton active loading={isLoading}>
        <Tabs
          activeKey={tabKey}
          onChange={(key) => {
            setTabKey(key);
          }}
          items={
            [
              // {
              //   children: <MemberDetailInfo member={member} />,
              //   key: 'info',
              //   label: 'Info',
              // },
            ]
          }
        />
      </Skeleton>
    </>
  );
};
