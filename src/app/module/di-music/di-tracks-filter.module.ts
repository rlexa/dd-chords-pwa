import {NgModule} from '@angular/core';
import {of} from 'rxjs';
import {DiTracksFilterPart, DiTracksFilterProvider, TracksFilter} from './di-tracks-filter';
import {DiTracksFilterPartFavorites, DiTracksFilterPartFavoritesProvider} from './di-tracks-filter-favorites';
import {DiTracksFilterPartPerformer, DiTracksFilterPartPerformerProvider} from './di-tracks-filter-performer';
import {DiTracksFilterPartQuery, DiTracksFilterPartQueryProvider} from './di-tracks-filter-query';

@NgModule({
  providers: [
    DiTracksFilterPartFavoritesProvider,
    DiTracksFilterPartPerformerProvider,
    DiTracksFilterPartQueryProvider,
    {provide: DiTracksFilterPart, multi: true, useValue: of<TracksFilter>({})},
    {provide: DiTracksFilterPart, multi: true, useExisting: DiTracksFilterPartFavorites},
    {provide: DiTracksFilterPart, multi: true, useExisting: DiTracksFilterPartPerformer},
    {provide: DiTracksFilterPart, multi: true, useExisting: DiTracksFilterPartQuery},
    DiTracksFilterProvider,
  ],
})
export class DiTracksFilterModule {}
