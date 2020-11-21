import {NgModule} from '@angular/core';
import {DiCurrentPerformersModule} from './di-current-performers';
import {DiCurrentTrackMetasModule} from './di-current-tracks';
import {DiTracksFilterModule} from './di-tracks-filter.module';

@NgModule({
  imports: [DiCurrentPerformersModule, DiCurrentTrackMetasModule, DiTracksFilterModule],
})
export class DiMusicModule {}
