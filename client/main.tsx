import 'reflect-metadata';

import 'antd/dist/reset.css';
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@adapters/ui/App';
import { DateUtils } from '@shared/utils/date.utils';

DateUtils.extend();

Meteor.startup(() => {
  const root = document.getElementById('react-target');

  if (!root) {
    throw new Error('No root element found');
  }

  createRoot(root).render(<App />);
});
