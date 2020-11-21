import {InjectionToken, NgModule, Provider} from '@angular/core';
import {Observable, of} from 'rxjs';
import {map, shareReplay, switchMap} from 'rxjs/operators';
import {Track} from 'src/music';
import {sortByTitle} from 'src/music/music';
import {DiTracksFilter, TracksFilter} from './di-tracks-filter';
import {TrackService} from './track.service';

export interface TrackMeta extends Pick<Track, 'id' | 'performer' | 'title'> {}

const trackToTrackMeta = (ii: Track): TrackMeta => ({id: ii.id, performer: ii.performer, title: ii.title});

const emptyTracksMetaArray: TrackMeta[] = [];

const filterStringValue = (filterBy: string | undefined, value: string | undefined): boolean => !filterBy || value === filterBy;

const filterTrack = (trackFilter: TracksFilter) => (track: Track) =>
  filterStringValue(trackFilter.performer, track.performer) && filterStringValue(trackFilter.title, track.title);

export const DiCurrentTrackMetas = new InjectionToken<Observable<TrackMeta[]>>('Current track list');
const DiCurrentTrackMetasProvider: Provider = {
  provide: DiCurrentTrackMetas,
  deps: [TrackService, DiTracksFilter],
  useFactory: (trackService: TrackService, tracksFilter$: Observable<TracksFilter>) =>
    tracksFilter$.pipe(
      switchMap((tracksFilter) =>
        !Object.keys(tracksFilter).length
          ? of(emptyTracksMetaArray)
          : trackService.tracks$.pipe(map((iis) => iis.filter(filterTrack(tracksFilter)).map(trackToTrackMeta).sort(sortByTitle))),
      ),
      shareReplay({refCount: true, bufferSize: 1}),
    ),
};

@NgModule({providers: [DiCurrentTrackMetasProvider]})
export class DiCurrentTrackMetasModule {}
