import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Routes } from '@ui/Routes/Routes';

export const App = () => {
  const { user, isLoggingIn } = useTracker(() => {
    const meteorUser = Meteor.user();

    const meteorLoggingIn = Meteor.loggingIn();

    return {
      isLoggingIn: meteorLoggingIn,
      user: meteorUser,
    };
  });

  console.log(user);

  if (isLoggingIn) {
    return <>Loading</>;
  }

  return (
    <React.StrictMode>
      <Routes />
    </React.StrictMode>
  );
};
