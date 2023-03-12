import '../imports/startup/client.startup';
import 'antd/dist/reset.css';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createRoot } from 'react-dom/client';
import { App } from '@ui/App';

Meteor.startup(() => {
  const root = document.getElementById('react-target');

  if (!root) {
    throw new Error('No root element found');
  }

  createRoot(root).render(<App />);
});
