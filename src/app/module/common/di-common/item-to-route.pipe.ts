import {Inject, Pipe, PipeTransform} from '@angular/core';
import {DiItemToRoute, FnItemToValue} from './di-item-to-x';

@Pipe({name: 'itemToRoute', pure: true})
export class ItemToRoutePipe<T> implements PipeTransform {
  constructor(@Inject(DiItemToRoute) public readonly itemToRoute: FnItemToValue<T, string>) {}

  transform(val: T): string {
    return this.itemToRoute(val) || '';
  }
}
