import {NgModule} from '@angular/core';
import {of} from 'rxjs';
import {DiPerformersFilterPartQuery, DiPerformersFilterPartQueryProvider} from './di-performer-filter-query';
import {DiPerformersFilterPart, DiPerformersFilterProvider, PerformersFilter} from './di-performers-filter';

@NgModule({
  providers: [
    DiPerformersFilterPartQueryProvider,
    {provide: DiPerformersFilterPart, multi: true, useValue: of<PerformersFilter>({})},
    {provide: DiPerformersFilterPart, multi: true, useExisting: DiPerformersFilterPartQuery},
    DiPerformersFilterProvider,
  ],
})
export class DiPerformersFilterModule {}
