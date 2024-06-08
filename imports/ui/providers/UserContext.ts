import { createContext, useContext } from 'react';

import { MemberEntity } from '@infra/mongo/entities/member.entity';

export interface UserContextProps {
  member: MemberEntity | null;
  user: Meteor.User | null;
}

export const UserContext = createContext<UserContextProps>({
  member: null,
  user: null,
});

export const useUserContext = () => useContext(UserContext);
