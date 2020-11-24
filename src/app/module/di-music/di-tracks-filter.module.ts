import {NgModule} from '@angular/core';
import {of} from 'rxjs';
import {DiTracksFilterPart, DiTracksFilterProvider, TracksFilter} from './di-tracks-filter';
import {DiTracksFilterPartPerformer, DiTracksFilterPartPerformerProvider} from './di-tracks-filter-performer';
import {DiTracksFilterPartQuery, DiTracksFilterPartQueryProvider} from './di-tracks-filter-query';

@NgModule({
  providers: [
    DiTracksFilterPartPerformerProvider,
    DiTracksFilterPartQueryProvider,
    {provide: DiTracksFilterPart, multi: true, useValue: of<TracksFilter>({})},
    {provide: DiTracksFilterPart, multi: true, useExisting: DiTracksFilterPartPerformer},
    {provide: DiTracksFilterPart, multi: true, useExisting: DiTracksFilterPartQuery},
    DiTracksFilterProvider,
  ],
})
export class DiTracksFilterModule {}
