import {Provider, Type} from '@angular/core';
import {Mock} from 'ts-mockery';

export const mockWith = <T>(provide: Type<T>, mock: T) => ({provide, useFactory: () => mock}) as Provider;

export const mockAll = <T>(provide: Type<T>) => mockWith(provide, Mock.all<T>());
