import {BehaviorSubject} from 'rxjs';
import {jsonEqual} from './util';

export class StateSubject<T> extends BehaviorSubject<T> {
  constructor(
    init: T,
    private readonly jsonEqual = false,
  ) {
    super(init);
  }

  override next(value: T): void {
    if (this.value === value || (this.jsonEqual && jsonEqual(this.value, value))) {
      return;
    }
    super.next(value);
  }
}
