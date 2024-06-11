import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import React, { PropsWithChildren, useMemo } from 'react';
import { container } from 'tsyringe';

import { MemberMongoCollection } from '@infra/mongo/collections/member.collection';
import { LoadingScreen } from '@ui/components/LoadingScreen';
import { UserContext } from '@ui/providers/UserContext';

const memberCollection = container.resolve(MemberMongoCollection);

export const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { user, isLoggingIn } = useTracker(
    () => ({ isLoggingIn: Meteor.loggingIn(), user: Meteor.user() }),
    [],
  );

  const isLoadingMember = useSubscribe('member');

  const { member } = useTracker(
    () => ({
      member: memberCollection.findOne({ userId: user?._id }) ?? null,
    }),
    [user],
  );

  const stateMemoized = useMemo(() => ({ member, user }), [user, member]);

  if (isLoggingIn || isLoadingMember()) {
    return <LoadingScreen />;
  }

  return (
    <UserContext.Provider value={stateMemoized}>
      {children}
    </UserContext.Provider>
  );
};
