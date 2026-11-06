import {setupZonelessTestEnv} from 'jest-preset-angular/setup-env/zoneless';
import {Mock} from 'ts-mockery';
import './jest-global-mocks';

Object.defineProperty(window, 'DragEvent', {
  value: class DragEvent {},
});

Mock.configure('jest');

setupZonelessTestEnv();
