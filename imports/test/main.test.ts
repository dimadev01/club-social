import 'chai/register-expect';
import 'reflect-metadata';
import { use } from 'chai';
import mockdate from 'mockdate';
import { restore } from 'sinon';
import sinonChai from 'sinon-chai';

use(sinonChai);

before(() => {
  mockdate.set('2024-01-01T00:00:00.000Z');
});

after(() => {
  mockdate.reset();
});

afterEach(() => {
  restore();
});
