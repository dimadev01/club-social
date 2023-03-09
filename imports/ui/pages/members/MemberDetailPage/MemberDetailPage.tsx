import React, { useEffect, useState } from 'react';
import { Breadcrumb, Spin, Tabs } from 'antd';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AppUrl } from '@ui/app.enum';
import { NotFound } from '@ui/components/NotFound';
import { useMember } from '@ui/hooks/members/useMember';
import { MemberDetailInfo } from '@ui/pages/members/MemberDetailPage/MemberDetailInfo';
import { MemberDetailMovementsGrid } from '@ui/pages/members/MemberDetailPage/MemberDetailMovementsGrid';

export const MembersDetailPage = () => {
  const { id } = useParams<{ id?: string }>();

  const navigate = useNavigate();

  const location = useLocation();

  const { data: member, fetchStatus: memberFetchStatus } = useMember(id);

  const [tabKey, setTabKey] = useState<string>();

  useEffect(() => {
    if (!tabKey) {
      if (location.hash) {
        setTabKey(location.hash.replace('#', ''));
      } else {
        navigate(`#info`);
      }
    }
  }, [location.hash, navigate, tabKey]);

  if (memberFetchStatus === 'fetching') {
    return <Spin spinning />;
  }

  if (!member) {
    return <NotFound />;
  }

  console.log('a');

  return (
    <>
      <Breadcrumb className="mb-8">
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to={AppUrl.Members}>Socios</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {!!member && `${member.firstName} ${member.lastName}`}
          {!member && 'Nuevo Socio'}
        </Breadcrumb.Item>
      </Breadcrumb>
      <Tabs
        activeKey={tabKey}
        onChange={(key) => {
          navigate(`#${key}`);

          setTabKey(key);
        }}
        items={[
          {
            children: <MemberDetailInfo member={member} />,
            key: 'info',
            label: 'Info',
          },
          {
            children: <MemberDetailMovementsGrid />,
            key: 'movements',
            label: 'Movimientos',
          },
        ]}
      />
    </>
  );
};
