import {Inject, Pipe, PipeTransform} from '@angular/core';
import {DiItemToTitle, FnItemToValue} from './di-item-to-x';

@Pipe({name: 'itemToTitle', pure: true})
export class ItemToTitlePipe<T> implements PipeTransform {
  constructor(@Inject(DiItemToTitle) public readonly itemToTitle: FnItemToValue<T, string>) {}

  transform(val: T): string {
    return this.itemToTitle(val) || '???';
  }
}
