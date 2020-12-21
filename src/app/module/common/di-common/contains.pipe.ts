import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'contains'})
export class ContainsPipe<T> implements PipeTransform {
  transform(collection: (T | undefined | null)[], item?: T): boolean {
    return collection?.includes(item);
  }
}
