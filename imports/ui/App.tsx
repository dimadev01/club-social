import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Routes } from '@ui/Routes/Routes';

export const App = () => {
  const { user } = useTracker(() => {
    const meteorUser = Meteor.user();

    return { user: meteorUser };
  });

  console.log(user);

  return (
    <React.StrictMode>
      <Routes />
    </React.StrictMode>
  );
};
