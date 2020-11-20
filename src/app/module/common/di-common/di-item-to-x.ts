import {InjectionToken} from '@angular/core';

export type FnItemToValue<T, V> = (item: T) => V;

export const DiItemToRoute = new InjectionToken<FnItemToValue<any, string>>('item => route');
export const DiItemToTitle = new InjectionToken<FnItemToValue<any, string>>('item => title');
