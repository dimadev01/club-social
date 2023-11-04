import React from 'react';
import { Card, Skeleton } from 'antd';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { MembersCollection } from '@domain/members/member.collection';
import { MemberMovementsGrid } from '@ui/components/Members/MemberMovementsGrid';

export const MemberMovementsPage = () => {
  const { member, memberIsLoading } = useTracker(() => ({
    member: MembersCollection.findOne(),
    memberIsLoading: !Meteor.subscribe('member').ready(),
  }));

  return (
    <Card title="Movimientos">
      <Skeleton active loading={memberIsLoading}>
        {member && <MemberMovementsGrid memberId={member?._id} />}
      </Skeleton>
    </Card>
  );
};
