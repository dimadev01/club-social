import 'reflect-metadata';

import 'antd/dist/reset.css';
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { createRoot } from 'react-dom/client';
import invariant from 'tiny-invariant';

import { DateUtils } from '@shared/utils/date.utils';
import { App } from '@ui/App';

DateUtils.extend();

Meteor.startup(() => {
  const root = document.getElementById('react-target');

  invariant(root);

  createRoot(root).render(<App />);
});
