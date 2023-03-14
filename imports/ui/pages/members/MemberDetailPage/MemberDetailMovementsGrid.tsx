import React from 'react';
import { Card } from 'antd';
import { Navigate, useParams } from 'react-router-dom';
import { AppUrl } from '@ui/app.enum';
import { MemberMovementsGrid } from '@ui/components/Members/MemberMovementsGrid';

export const MemberDetailMovementsGrid = () => {
  const { id } = useParams<{ id?: string }>();

  if (!id) {
    return <Navigate to={AppUrl.Members} />;
  }

  return (
    <Card>
      <MemberMovementsGrid memberId={id} />
    </Card>
  );
};
