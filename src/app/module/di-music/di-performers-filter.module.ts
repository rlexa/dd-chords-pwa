import {NgModule} from '@angular/core';
import {of} from 'rxjs';
import {DiPerformersFilterPartFavorites, DiPerformersFilterPartFavoritesProvider} from './di-performer-filter-favorites';
import {DiPerformersFilterPartQuery, DiPerformersFilterPartQueryProvider} from './di-performer-filter-query';
import {DiPerformersFilterPart, DiPerformersFilterProvider, PerformersFilter} from './di-performers-filter';

@NgModule({
  providers: [
    DiPerformersFilterPartFavoritesProvider,
    DiPerformersFilterPartQueryProvider,
    {provide: DiPerformersFilterPart, multi: true, useValue: of<PerformersFilter>({})},
    {provide: DiPerformersFilterPart, multi: true, useExisting: DiPerformersFilterPartFavorites},
    {provide: DiPerformersFilterPart, multi: true, useExisting: DiPerformersFilterPartQuery},
    DiPerformersFilterProvider,
  ],
})
export class DiPerformersFilterModule {}
