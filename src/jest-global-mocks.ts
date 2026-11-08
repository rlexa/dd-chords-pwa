/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable prefer-rest-params */

import {ngMocks} from 'ng-mocks';

ngMocks.autoSpy('jest');

/**
 * jest should fail on console.error logging so let's monkey-patch it to throw an actual error.
 */
let error = console.error;
console.error = function (message: any) {
  error.apply(console, arguments as any); // keep default behaviour
  throw message instanceof Error ? message : new Error(message);
};

const getMockStorage = () => {
  let storage: Record<string, string> = {};
  return {
    getItem: (key: string) => (key in storage ? storage[key] : null),
    setItem: (key: string, value: string) => (storage[key] = value || ''),
    removeItem: (key: string) => delete storage[key],
    clear: () => (storage = {}),
  };
};
Object.defineProperty(window, 'localStorage', {value: getMockStorage()});
Object.defineProperty(window, 'sessionStorage', {value: getMockStorage()});

// getComputedStyle - fake it because Angular checks in which browser it executes
Object.defineProperty(window, 'getComputedStyle', {value: () => ['-webkit-appearance']});

// freeze current time for application testing — Date.UTC so the epoch is the same on every machine, whatever its timezone
const now = Date.UTC(2000, 0, 2, 12, 0, 0);
const OrigDate = global.Date;
// @ts-expect-error
global.Date = function (...args: unknown[]) {
  if (args.length === 0) {
    return new OrigDate(now);
  }
  // @ts-expect-error
  return new OrigDate(...args);
};
global.Date.UTC = OrigDate.UTC;
global.Date.parse = OrigDate.parse;
global.Date.now = jest.fn(() => now);
(global.Date as any).prototype = OrigDate.prototype; // This makes instanceof Date work

// deterministic random() function
Math.random = () => 0.12345;
