import {NgModule} from '@angular/core';
import {of} from 'rxjs';
import {DiTracksFilterPart, DiTracksFilterProvider, TracksFilter} from './di-tracks-filter';
import {DiTracksFilterPartPerformer, DiTracksFilterPartPerformerProvider} from './di-tracks-filter-performer';

@NgModule({
  providers: [
    DiTracksFilterPartPerformerProvider,
    {provide: DiTracksFilterPart, multi: true, useValue: of<TracksFilter>({})},
    {provide: DiTracksFilterPart, multi: true, useExisting: DiTracksFilterPartPerformer},
    DiTracksFilterProvider,
  ],
})
export class DiTracksFilterModule {}
