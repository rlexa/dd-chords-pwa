import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'contains', pure: true, standalone: true})
export class ContainsPipe<T> implements PipeTransform {
  transform(collection: (T | undefined | null)[], item?: T) {
    return collection?.includes(item);
  }
}
